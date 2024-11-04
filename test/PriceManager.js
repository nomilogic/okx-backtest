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
    return this.#time;
  }
  
  constructor(initialPrice) {
    super(); // Call the parent constructor
    this.price = initialPrice;
    this.minPercentChange = -0.010014; // Minimum fluctuation percentage (-0.5%)
    this.maxPercentChange = 0.010014; // Maximum fluctuation percentage (+0.5%)
    this.priceLoop = null;
    this.startTime = null;
    this.elapsedMs = 0; // Track elapsed milliseconds
    this._time=Date.now();
/*************  ✨ Codeium Command ⭐  *************/
  /**
   * Constructor for PriceManager
   * @param {number} initialPrice - Initial price value
   * @description
   * This constructor initializes the PriceManager with the given initial price.
   * It also sets the minimum and maximum fluctuation percentages to -0.5% and +0.5% respectively.
   * The priceLoop, startTime, and elapsedMs properties are initialized to null, null, and 0 respectively.
   * The updatePrice method is called at the end of the constructor to trigger the initial price update.
   */
/******  a07c6e2d-c21a-4e90-b896-3c78e59f0aa6  *******/    this.updatePrice() 
  
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