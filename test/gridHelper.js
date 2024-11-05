class Grid {
    constructor({
      lowerPrice = 0.0010,
      upperPrice = 0.0020,
      gridQuantity = 10,
      totalAmountUSDT = 10,
      creationPrice = 0.0015,
      lastPrice = 0.0015
    } = {}) {
      this.lowerPrice = lowerPrice;
      this.upperPrice = upperPrice;
      this.gridQuantity = gridQuantity;
      this.amountPerGrid = (totalAmountUSDT/( (lowerPrice + (upperPrice - ( (upperPrice-lowerPrice) / gridQuantity ) ) )/2))/gridQuantity
      this.totalAmountUSDT = totalAmountUSDT;
      this.creationPrice = creationPrice;
      this.lastPrice = lastPrice;
      this.averagePrice=(upperPrice-lowerPrice)/gridQuantity
  
      // Calculate grid levels and initialize open buy orders
      this.gridLevels = this.calculateGridLevels();
      this.activeBuyOrders = this.gridLevels.map(level => ({ price: level, quantity: this.amountPerGrid }));
      this.filledSellOrders = []; // Orders that have been bought and are waiting to be sold
    }
  
    // Method to calculate grid levels between lowerPrice and upperPrice
    calculateGridLevels() {
      const gridLevels = [];
      const priceInterval = (this.upperPrice - this.lowerPrice) / (this.gridQuantity);
      
      for (let i = 0; i < this.gridQuantity; i++) {
        gridLevels.push(this.lowerPrice + i * priceInterval);
      }
  console.log(gridLevels)
      return gridLevels;
    }
  
    // Method to check and execute buy orders based on the current price
    checkBuyOrders(currentPrice) {
      this.activeBuyOrders = this.activeBuyOrders.filter(order => {
        if (currentPrice <= order.price) {
          console.log(`Buy order filled at price: ${order.price} for quantity: ${order.quantity}`);
          this.filledSellOrders.push(order); // Move to filled sell orders
          return false; // Remove from active buy orders
        }
        return true;
      });
    }
  
    // Method to check and execute sell orders based on the current price
    checkSellOrders(currentPrice) {
      this.filledSellOrders = this.filledSellOrders.filter(order => {
        const targetSellPrice = order.price + this.averagePrice // 1.01; // For example, 1% profit target
        if (currentPrice >= targetSellPrice) {
          console.log(currentPrice, targetSellPrice)
          console.log(`Sell order executed at price: ${targetSellPrice} for quantity: ${order.quantity}`);
          return false; // Remove from filled sell orders
        }
        return true;
      });
    }
  
    // Method to update the current price and trigger buy/sell checks
    updatePrice(currentPrice) {
      console.log(`Updating price to: ${currentPrice}`);
      this.checkBuyOrders(currentPrice);
      this.checkSellOrders(currentPrice);
      this.lastPrice = currentPrice;
    }
  
    // Method to view the status of all orders
    viewOrders() {
      return {
        activeBuyOrders: this.activeBuyOrders,
        filledSellOrders: this.filledSellOrders,
      };
    }
  }
  
  
  const gridBot = new Grid();
  gridBot.updatePrice(0.0018); // Check for buy orders
  gridBot.updatePrice(0.0015); // Check for buy orders
  gridBot.updatePrice(0.0019); // Check for buy orders
  gridBot.updatePrice(0.0012); // Check for buy orders
  gridBot.updatePrice(0.0017); // Check for buy orders
  gridBot.updatePrice(0.0012); // Check for sell orders as price increases
  console.log(gridBot.viewOrders());
  