class CryptoOrder {
  constructor({
    type,
    price,
    quantity,
    orderId = null,
    status = 'open',
    timestamp = Date.now(),
    stopLoss = null,
    takeProfit = null
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
    return 'order-' + Math.random().toString(36).substr(2, 9);
  }

  fill() {
    this.filled = true;
    this.status = 'filled';
    console.log(`${this.type.charAt(0).toUpperCase() + this.type.slice(1)} order ${this.orderId} filled at price: ${this.price}`);
  }
}

class AdvancedOrder {
  constructor({ buyOrder, takeProfit, auto = false, orderManager }) {
    this.buyOrder = buyOrder;
    this.sellOrder = null;
    this.takeProfit = takeProfit;
    this.pnl = 0;
    this.auto = auto;
    this.orderManager = orderManager;
    this.orderManager.addOrder(this.buyOrder);
  }

  checkAndCreateSell(currentPrice) {
    if (this.buyOrder.filled && !this.sellOrder) {
      this.sellOrder = new CryptoOrder({
        type: 'sell',
        price: this.takeProfit,
        quantity: this.buyOrder.quantity
      });
      this.orderManager.addOrder(this.sellOrder);
      console.log(`Sell order created at price: ${this.takeProfit} for quantity: ${this.buyOrder.quantity}`);
    }

    if (this.sellOrder && currentPrice >= this.sellOrder.price) {
      this.sellOrder.fill();
      this.pnl = this.sellOrder.price - this.buyOrder.price;
      console.log(`Advanced order completed with PnL: ${this.pnl}`);

      if (this.auto) {
        this.resetOrder(currentPrice);
      }
    }
  }

  resetOrder(currentPrice) {
    this.buyOrder = new CryptoOrder({
      type: 'buy',
      price: currentPrice,
      quantity: this.sellOrder.quantity
    });
    this.orderManager.addOrder(this.buyOrder);
    this.sellOrder = null;
    console.log(`New buy order created at price: ${currentPrice}`);
  }
}

class OrderManager {
  constructor() {
    this.orders = [];
  }

  addOrder(order) {
    this.orders.push(order);
    console.log(`Order added: ${order.orderId} - ${order.type} at price: ${order.price}`);
  }

  getOrdersByStatus(status) {
    return this.orders.filter(order => order.status === status);
  }

  viewOrderHistory() {
    return this.orders.map(order => ({
      id: order.orderId,
      type: order.type,
      price: order.price,
      quantity: order.quantity,
      status: order.status,
      timestamp: order.timestamp
    }));
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
    orderManager
  } = {}) {
    this.lowerPrice = lowerPrice;
    this.upperPrice = upperPrice;
    this.gridQuantity = gridQuantity;
    this.totalAmountUSDT = totalAmountUSDT;
    this.creationPrice = creationPrice;
    this.lastPrice = lastPrice;
    this.averagePrice = (upperPrice - lowerPrice) / gridQuantity;
    this.amountPerGrid = (totalAmountUSDT / gridQuantity) / ((upperPrice + lowerPrice) / 2);
    this.orderManager = orderManager;

    this.gridLevels = this.calculateGridLevels();
    this.activeOrders = this.gridLevels.map(level => new AdvancedOrder({
      buyOrder: new CryptoOrder({
        type: 'buy',
        price: level,
        quantity: this.amountPerGrid
      }),
      takeProfit: level + this.averagePrice,
      auto: true,
      orderManager: this.orderManager
    }));
  }

  calculateGridLevels() {
    const gridLevels = [];
    const interval = (this.upperPrice - this.lowerPrice) / this.gridQuantity;
    for (let i = 0; i < this.gridQuantity; i++) {
      gridLevels.push(this.lowerPrice + i * interval);
    }
    return gridLevels;
  }

  updatePrice(currentPrice) {
    console.log(`Updating price to: ${currentPrice}`);
    
    // Check all buy orders and fill those that are at or below the current price
    this.activeOrders.forEach(order => {
      if (!order.buyOrder.filled && currentPrice <= order.buyOrder.price) {
        order.buyOrder.fill();
      }

      // If the buy order is filled, check if sell conditions are met
      order.checkAndCreateSell(currentPrice);
    });
    
    this.lastPrice = currentPrice;
  }

  viewOrders() {
    return {
      activeOrders: this.activeOrders,
      orderHistory: this.orderManager.viewOrderHistory()
    };
  }
}

// Instantiate the OrderManager
const orderManager = new OrderManager();

// Example usage
const gridBot = new Grid({
  lowerPrice: 0.0010,
  upperPrice: 0.0020,
  gridQuantity: 5,
  totalAmountUSDT: 10,
  creationPrice: 0.0015,
  lastPrice: 0.0015,
  orderManager: orderManager
});

gridBot.updatePrice(0.0011); // Fills buy orders if price is at or below buy levels
gridBot.updatePrice(0.0018); // Checks sell conditions for filled buy orders
console.log(gridBot.viewOrders());
