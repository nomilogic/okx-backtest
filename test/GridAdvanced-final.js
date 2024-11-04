
class EventDispatcher {
    constructor() {
      this._listeners = {};
    }
  
    static Events = {
      PRICE_UPDATED: "priceUpdated",
    };
  
    addEventListener(event, callback) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(callback);
    }
  
    removeEventListener(event, callback) {
      if (!this._listeners[event]) return;
  
      const index = this._listeners[event].indexOf(callback);
      if (index > -1) {
        this._listeners[event].splice(index, 1);
      }
    }
  
    dispatchEvent(event, data) {
      if (!this._listeners[event]) return;
  
      this._listeners[event].forEach((callback) => {
        callback(data);
      });
    }
  }
  
class CryptoOrder {
  constructor({
    type,
    price,
    quantity,
    orderId = null,
    status = "open",
    timestamp = PriceManager.time,
    stopLoss = null,
    takeProfit = null,
    filledAt = null,
  }) {
    this.type = type;
    this.price = price;
    this.quantity = quantity;
    this.orderId = orderId || this.generateOrderId();
    this.status = status;
    this.timestamp = timestamp;
    this.stopLoss = stopLoss;
    this.takeProfit = takeProfit;
    this.filled = false;
  }

  generateOrderId() {
    return "order-" + Math.random().toString(36).substr(2, 9);
  }

  fill(currentPrice = this.price) {
    this.filled = true;
    this.status = "filled";
    console.log(
      `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} order ${
        this.orderId
      } filled at price: ${PriceManager.currentPrice} of fill Price ${this.price}`
    );
    this.filledAt = PriceManager.currentPrice;
  }
}

class AdvancedOrder {
  constructor({ quantity, sellPrice, buyPrice, auto = false, orderManager }) {
    this.sellOrder = null;
    this.sellPrice = Number(sellPrice.toFixed(8));
    this.buyPrice = Number(buyPrice.toFixed(8));
    this.quantity = Number(quantity.toFixed(2));

    this.pnl = 0;
    this.auto = auto;
    this.orderManager = orderManager;
    this.createNewTpLimitOrder();
   // this.buyOrder = orderManager.CreateNewOrder();

    //this.orderManager.addAdvancedOrder(this.buyOrder);
  }

  checkAndCreateSell(currentPrice) {
    const checkbuy=this.buyOrder!==null ? this.checkAndPerfomOrderBuyOrSell(this.buyOrder):"";
    const checkSell=null !== this.sellOrder ? this.checkAndPerfomOrderBuyOrSell(this.sellOrder):"";
    //this.checkAndPerfomOrderBuyOrSell(this.buyOrder);

    if (this.buyOrder.filled && !this.sellOrder) {
      let orderInfo = {
        type: "sell",
        price: this.sellPrice,
        quantity: this.buyOrder.quantity,
      };
      this.sellOrder = this.orderManager.CreateNewOrder(
        orderInfo.type,
        orderInfo.price,
        orderInfo.quantity
      );
      
      console.log(
        `Sell order created at price: ${this.sellPrice} for quantity: ${this.buyOrder.quantity}`
      );
    }

    if (this.sellOrder && this.sellOrder.filled) {
     // this.sellOrder.fill(currentPrice);
      this.pnl = Number((this.sellOrder.filledAt - this.buyOrder.filledAt).toFixed(8));

      console.log(`Advanced order completed with PnL: ${this.pnl}`);
      this.orderManager.addOrderBnS({
        buyOrder: this.buyOrder,
        sellOrder: this.sellOrder,
        pnl:this.pnl
      });
      if (this.auto) {
        this.resetOrder();
      }
    }
  }
  checkAndPerfomOrderBuyOrSell(order) {
    if (
      order.type === "buy" &&
      !order.filled &&
      PriceManager.currentPrice <= order.price
    ) {
      order.fill(PriceManager.currentPrice);
      console.log(order,"orderFilled -- ")

    } else if (
      order.type === "sell" &&
      !order.filled &&
      PriceManager.currentPrice >= order.price
    ) {
      order.fill(PriceManager.currentPrice);
      console.log(order,PriceManager.currentPrice)
    }

    // If the buy order is filled, check if sell conditions are met
    // order.checkAndCreateSell(currentPrice);
  }

  createNewTpLimitOrder() {
    let orderInfo = {
      type: "buy",
      price: this.buyPrice,
      quantity: this.quantity,
    };
    this.buyOrder = this.orderManager.CreateNewOrder(orderInfo.type, orderInfo.price, orderInfo.quantity);
    this.sellOrder = null;
    console.log(
      `New buy order created at price: ${PriceManager.currentPrice} to buy at ${this.buyPrice}`
    );
    console.log(this.buyOrder);
  }

  resetOrder() {
    this.createNewTpLimitOrder(PriceManager.currentPrice);
  }
}

class OrderManager extends EventDispatcher {
  static Events = {
    ...EventDispatcher.Events, // Include base events
    PRICE_CHANGED: "priceChanged", // Event for price changes
    COMPLETED: "completed", // Event for normal completion
    STOPPED: "stopped", // Event for forced stop
  };

  constructor() {
    super(); // Call the parent constructor
    this.orders = [];
    this.ordersBnS = [];
  }

  generateOrderId() {
    return "order-" + Math.random().toString(36).substr(2, 9);
  }
  addOrder(order) {
    this.orders.push(order);
    console.log(
      `Order added: ${order.orderId} - ${order.type} at price: ${order.price}`
    );
  }
  addOrderBnS(orderBnS) {
    this.ordersBnS.push(orderBnS);
    console.log(`Order Buy and Sell filled: ${orderBnS}`);
    console.log(orderBnS);
  }

  getOrdersByStatus(status, type = null) {
    let openBuyOrders = this.orders
      .filter((order) => order.status === status)
      .filter((order) => order.type === "buy");
    let openSellOrders = this.orders
      .filter((order) => order.status === status)
      .filter((order) => order.type === "sell");
    return {
      sellOrders: openSellOrders,
      buyOrders: openBuyOrders,
    };
  }

  viewOrderHistory({ type = "", price = {}, quantity = {}, status = "" } = {}) {
    return this.orders
      .filter((order) => {
        // Type filter
        if (type && order.type !== type) return false;

        // Price filter
        if (price.exact !== undefined && order.price !== price.exact)
          return false;
        if (price.min !== undefined && order.price < price.min) return false;
        if (price.max !== undefined && order.price > price.max) return false;

        // Quantity filter
        if (quantity.exact !== undefined && order.quantity !== quantity.exact)
          return false;
        if (quantity.min !== undefined && order.quantity < quantity.min)
          return false;
        if (quantity.max !== undefined && order.quantity > quantity.max)
          return false;

        // Status filter
        if (status && order.status !== status) return false;

        return true;
      })
      .map((order) => ({
        id: order.orderId,
        type: order.type,
        price: order.price,
        quantity: order.quantity,
        status: order.status,
        timestamp: order.timestamp,
      }));
  }
  viewOrderBnSHistory() {
    return this.ordersBnS;
  }

  CreateNewOrder(type = "buy", price = 0, quantity = 0) {
    const order = new CryptoOrder({
      type: type,
      price: price,
      quantity: quantity,
    });
    this.addOrder(order);

    return order;
  }

  onPriceChange(currentPrice) {
   // console.log(currentPrice," price change ")
    this.orders.forEach((order) => {
      if (
        order.type === "buy" &&
        !order.filled &&
        currentPrice >= order.price
      ) {
        order.fill(currentPrice);
        console.log(order,"orderFilled -- ")

      } else if (
        order.type === "sell" &&
        !order.filled &&
        currentPrice >= order.price
      ) {
        order.fill(currentPrice);
        console.log(order,"orderFilled")
      }

      // If the buy order is filled, check if sell conditions are met
      // order.checkAndCreateSell(currentPrice);
    });
  }
}

class Grid {
  constructor({
    lowerPrice,
    upperPrice,
    gridQuantity,
    totalAmountUSDT,
    creationPrice,
    lastPrice,
    orderManager,
    cryptoName = "Crypto",
  } = {}) {
    this.lowerPrice = lowerPrice;
    this.upperPrice = upperPrice;
    this.gridQuantity = gridQuantity;
    this.totalAmountUSDT = totalAmountUSDT;
    this.creationPrice = creationPrice;
    this.lastPrice = lastPrice;
    this.startTime = PriceManager.time;
    this.cryptoName = cryptoName;
    this.averagePrice = (upperPrice - lowerPrice) / gridQuantity;
    this.amountPerGrid =
      totalAmountUSDT / gridQuantity / ((upperPrice + lowerPrice) / 2);
    this.orderManager = orderManager;

    this.gridLevels = this.calculateGridLevels();
    this.activeOrders = this.gridLevels.map(
      (level) =>
        new AdvancedOrder({
          quantity: this.amountPerGrid,
          sellPrice: level + this.averagePrice,
          buyPrice: level,
          auto: true,
          orderManager: this.orderManager,
        })
    );

    // Initialize profit calculations
    this.profitPerGrid = this.calculateProfitPerGrid();
    this.totalPnL = 0;
    this.unpairedPnL = 0;
    this.investmentAmount = totalAmountUSDT;
  }

  calculateGridLevels() {
    const gridLevels = [];
    const interval = (this.upperPrice - this.lowerPrice) / this.gridQuantity;
    for (let i = 0; i < this.gridQuantity; i++) {
      gridLevels.push(this.lowerPrice + i * interval);
    }
    return gridLevels;
  }

  // Method to calculate profit per grid
  calculateProfitPerGrid() {
    return this.activeOrders.map((order) => {
      const sellPrice = order.sellPrice;
      const buyPrice = order.buyPrice;
      const profitPerGrid = (sellPrice - buyPrice) * order.quantity;
      return {
        gridLevel: buyPrice,
        sellPrice,
        profit: profitPerGrid.toFixed(4),
      };
    });
  }

  getTotalDuration() {
    const elapsedMs = PriceManager.time - this.startTime;
    return this.formatElapsedTime(elapsedMs);
  }

  formatElapsedTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return days > 0
      ? `${days}d ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  updatePnL(currentPrice) {
    this.totalPnL = this.orderManager.ordersBnS.reduce((total, orderBnS) => {
     /*  if (order.filled) {
        return total + (order.type === 'sell' ? Number(order.filledAt) - Number(order.price) : 0);
      } */
      if (orderBnS.sellOrder.filled) {
        return total + orderBnS.pnl
      }
      return total;
    }, 0);

    this.unpairedPnL = this.activeOrders.reduce((total, order) => {
      if (order.buyOrder.filled && !order.sellOrder.filled) {
        return total + ((Number(currentPrice)) * Number(order.buyOrder.quantity))-( (Number(order.buyOrder.filledAt)) * Number(order.buyOrder.quantity));
      }
      return total;
    }, 0);
  }
   usdtUsed(){
    return this.activeOrders.reduce((total, order) => {
    if (order.buyOrder.filled && !order.sellOrder.filled) {
      return total + (Number(order.buyOrder.filledAt)) * Number(order.buyOrder.quantity);
    }
    return total;
  }, 0)}
  getGridSummary(currentPrice) {
    this.updatePnL(currentPrice); // Update PnL based on the current price

    const currentHoldings = {
      crypto: this.activeOrders.reduce((total, order) => total + (order.buyOrder.filled ? order.quantity:0), 0),
      usdtFree: this.totalAmountUSDT - this.usdtUsed(),
      usdtUsed:this.usdtUsed(),
     
    };

    const priceRange = {
      min: this.lowerPrice,
      max: this.upperPrice,
      gridQuantity: this.gridQuantity,
      gridMode: "Arithmetic",
      amountPerGrid: this.amountPerGrid,
      profitPerGrid: this.profitPerGrid, // Use stored profit per grid
    };

    const conditions = {
      sellAllWhenBotStops: true,
      creationPrice: this.creationPrice,
      startCondition: "Instant",
      stopCondition: "Manual",
      trailing: {
        up: false,
        down: false,
      },
      takeProfit: "--",
      stopLoss: "--",
    };

    return {
      logo: "path/to/logo.png", // Update with your actual logo path
      tradingPair: `${this.cryptoName}/USDT`,
      botType: "Spot Grid",
      runtime: {
        duration: this.getTotalDuration(),
        created: new Date(this.startTime).toLocaleString(),
      },
      totalPnL: {
        total: `${this.totalPnL.toFixed(8)} USDT`,
        percentage: `${((this.totalPnL / this.investmentAmount) * 100).toFixed(2)}%`,
        gridProfit: `${this.totalPnL.toFixed(4)} USDT`,
        unpairedPnL: `${this.unpairedPnL.toFixed(4)} USDT`,
        investmentAmount: `${this.investmentAmount.toFixed(4)} USDT`,
        feeRebate: {
          crypto: "0.00 " + this.cryptoName,
          usdt: "0.00 USDT",
        },
      },  
      currentHoldings: {
        crypto: currentHoldings.crypto.toFixed(4),
        valueInUSDT:this.usdtUsed().toFixed(4) + ` USDT`,
        initial: {
          crypto: "0 " + this.cryptoName,
          usdt: `${this.investmentAmount.toFixed(4)} USDT`,
        },
      },
      priceRange: priceRange,
      conditions: conditions,
      executionOverview: {
        totalExecutions: this.orderManager.orders.filter(order => order.filled).length,
        totalArbitrageTimes: 1,
        gridOrderDetails: {
          lastPrice: `${currentPrice}`,
          amountPerGrid: `${this.amountPerGrid.toFixed(4)} ${this.cryptoName}`,
          buyOrders: this.orderManager.getOrdersByStatus("open", "buy").buyOrders.length,
          sellOrders: this.orderManager.getOrdersByStatus("open", "sell").sellOrders.length,
        },
      },
      orderHistory: this.orderManager.viewOrderHistory(),
      eventHistory: [],
    };
  }

  updatePrice(currentPrice) {
    this.activeOrders.forEach((order) => {
      order.checkAndCreateSell(currentPrice);
    });
    this.lastPrice = currentPrice;
  }

  viewOrders() {
    return {
      openOrders: this.orderManager.getOrdersByStatus("open"),
      activeOrders: this.activeOrders,
      orderHistory: this.orderManager.viewOrderHistory(),
      orderBnSHistory: this.orderManager.viewOrderBnSHistory(),
    };
  }
}


``;
class PriceManager extends EventDispatcher {
  static Events = {
    ...EventDispatcher.Events, // Include base events
    PRICE_CHANGED: "priceChanged", // Event for price changes
    COMPLETED: "completed", // Event for normal completion
    STOPPED: "stopped", // Event for forced stop
  };
  
   static #currentPrice = 0;
   static #time = 0;
  // Static getter for the currentPrice
  static get currentPrice() {
    return PriceManager.#currentPrice;
  }
  static get time() {
    return PriceManager.#time;
  }
  
  constructor(initialPrice) {
    
    super(); // Call the parent constructor
    this.price = initialPrice;
    this.minPercentChange = -0.02; // Minimum fluctuation percentage (-0.5%)
    this.maxPercentChange = 0.02; // Maximum fluctuation percentage (+0.5%)
    this.priceLoop = null;
    this.startTime = null;
    this.elapsedMs = 0; // Track elapsed milliseconds
    this._time=Date.now();
    this.updatePrice() 

    console.log(this, PriceManager.currentPrice, PriceManager.time);
      
  }

  // Method to update the price with a random fluctuation
  updatePrice() {
    const percentChange =
      (Math.random() * (this.maxPercentChange - this.minPercentChange) +
        this.minPercentChange) /
      100;
   this.price = parseFloat(
      (this.price * (1 + percentChange)).toFixed(8)
    ); // Keep two decimal points

    this.price=Number(this.price.toFixed(8))
    // Get current time
    //const currentTime = new Date().toISOString(); // Use ISO format for the timestamp
    PriceManager.#currentPrice=this.price;
    PriceManager.#time=this._time;
    // Dispatch the priceChanged event with the current price and timestamp
    this.dispatchEvent(PriceManager.Events.PRICE_CHANGED, {
      price: this.price,
      time: this._time,
    }); // Notify the 'priceChanged' event
   // this.time=currentTime;
  }

  // Helper to convert time format to milliseconds
  parseTimeInterval(timeString) {
    const unit =
      timeString.slice(-2) != "ms"
        ? timeString.slice(-1)
        : timeString.slice(-2); // Last character (s, m, h, d)
    let value = parseInt(timeString.slice(0, 0 - unit.length), 10); // Numeric part

    switch (unit) {
      case "ms":
        return value; // seconds to milliseconds
      case "s":
        return value * 1000; // seconds to milliseconds
      case "m":
        return value * 60 * 1000; // minutes to milliseconds
      case "h":
        return value * 60 * 60 * 1000; // hours to milliseconds
      case "d":
        return value * 24 * 60 * 60 * 1000; // days to milliseconds
      default:
        throw new Error("Invalid time unit. Use 's', 'm', 'h', or 'd'.");
    }
  }

  // Method to format elapsed time using Date object
  formatElapsedTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
    if (days > 0) {
      return `${days}d ${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; // Dd HH:MM:SS
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; // HH:MM:SS
    }
  }
  

  // Start the price fluctuation loop with flexible intervals and a target time
  start(interval = 1000, targetTime = "1m", speedMultiplier = 1) {
    this.stop(); // Ensure no duplicate intervals

    // Calculate adjusted target duration based on speed multiplier
    const targetDuration = this.parseTimeInterval(targetTime);
    this.startTime =this._time;
   // this._time=this.startTime;
    this.elapsedMs = 0; // Reset elapsed milliseconds

    // Begin loop
    this.priceLoop = setInterval(() => {
      this.elapsedMs += interval * speedMultiplier; // Increment elapsed time by interval multiplied by speed
      this._time=this.startTime+this.elapsedMs;
      if (this.elapsedMs >= targetDuration) {
        this.stop(); // Stop the loop when adjusted target time is reached
        this.dispatchEvent(
          PriceManager.Events.COMPLETED,
          this.createDummyValue()
        ); // Dispatch completed event
        console.log("Target duration reached. Stopping price updates.");
      } else {
        this.updatePrice(); // Update price at each interval
      }
    }, interval);
  }

  startFast(
    targetTime = "1m",
    intervalTime = "1s",
    maxIterations = 1000,
    breakTime = "1s"
  ) {
    this.stop(); // Ensure no duplicate intervals

    // Parse durations
    const targetDuration = this.parseTimeInterval(targetTime);
    const interval = this.parseTimeInterval(intervalTime);
    const breakDuration = this.parseTimeInterval(breakTime);

    this.startTime = Date.now();
    this._time=this.startTime;
    this.elapsedMs = 0; // Reset elapsed time
    let batchs = 0;

    console.log(targetDuration, interval, breakDuration, maxIterations, batchs);
    const processBatch = () => {
      let iterations = 0;
      batchs++;

      // Perform a batch of exactly maxIterations
      while (iterations < maxIterations) {
        this.updatePrice(); // Update price per iteration
        this.elapsedMs += interval;
        this._time=this.startTime+this.elapsedMs;
        iterations++;

        // Check if we've reached the target duration during this batch
        if (this.elapsedMs >= targetDuration) {
          this.stop();
          this.dispatchEvent(
            PriceManager.Events.COMPLETED,
            this.createDummyValue()
          ); // Dispatch completed event
          console.log("Target duration reached. Stopping price updates.");
          return; // Exit if target duration is reached
        }
      }
      console.log(`Batch complete ${batchs}, ${this.price} ,${new Date(PriceManager.time).toDateString()}`);

      // Schedule the next batch with a break time
      setTimeout(processBatch, breakDuration);
    };

    processBatch(); // Start the first batch
  }

  // Create a dummy value upon completion
  createDummyValue() {
    return {
      finalPrice: this.price,
      elapsedTime: this.formatElapsedTime(this.elapsedMs), // Format elapsed time
      message: "Price fluctuation completed successfully.",
    };
  }

  // Stop the price fluctuation loop
  stop() {
    if (this.priceLoop) {
      clearInterval(this.priceLoop);
      this.priceLoop = null;
      this.dispatchEvent(PriceManager.Events.STOPPED, {
        message: "Price fluctuation stopped forcibly.",
      }); // Notify stopped event
    }
  }
}

// Example usage:
const priceManager = new PriceManager(0.0015); // Initial price of $100

// Instantiate the OrderManager
const orderManager = new OrderManager();

// Example usage
const gridBot = new Grid({
  lowerPrice: 0.001,
  upperPrice: 0.002,
  gridQuantity: 5,
  totalAmountUSDT: 10,
  creationPrice: 0.0015,
  lastPrice: 0.0015,
  orderManager: orderManager,
});


// Add an event listener for price changes
priceManager.addEventListener(
  PriceManager.Events.PRICE_CHANGED,
  ({ price, time }) => {
    // console.log(`Price updated: $${price} at ${time}`);
    //orderManager.onPriceChange(price);
    gridBot.updatePrice(price); // Fills buy orders if price is at or below buy levels

  }
);

// Add event listener for completion
priceManager.addEventListener(PriceManager.Events.COMPLETED, (dummy) => {
  console.log(
    `Price fluctuation completed. Final price: $${dummy.finalPrice.toFixed(8)}. Elapsed time: ${dummy.elapsedTime}. Message: ${dummy.message}`
  );
  console.log(gridBot.viewOrders());
  console.log(gridBot.getGridSummary(PriceManager.currentPrice));
});

// Add event listener for forced stop
priceManager.addEventListener(PriceManager.Events.STOPPED, (data) => {
  console.log(data.message);

  console.log(gridBot.viewOrders());
});

// Start the price fluctuation loop
//priceManagerpriceManager.start(1, '30d', 1000);
priceManager.startFast("15d", "1s", 10000, "1ms");

// To stop the price updates manually, call:
// priceManager.stop();

// Add an event listener for price changes

// Start the price fluctuation loop with:
// - 1-second intervals
// - running for a "perceived" duration of 1 minute
// - at 2x speed (1 minute will complete in 30 seconds)

// To stop the price updates manually, call:
// priceManager.stop();

//gridBot.updatePrice(0.0018); // Checks sell conditions for filled buy orders
