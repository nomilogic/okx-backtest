// gridInfouration for the grid trading system
const gridInfo = {
    lowerPrice: 0.0020,                        // Lower price for buy orders
    upperPrice: 0.0030,                        // Upper price for sell orders
    gridQuantity: 5,                           // Total number of grids
    amountPerGrid: 1000,
    totalAmountUSDT:10,// Amount per grid in MYRIA
    amountUsdtPerGrid: 0,
    creationPrice: 0.0020,                     // Price at which the bot was created
    lastPrice: 0.00265,               // Last price in USDT
    
};


gridInfo.amountUsdtPerGrid=gridInfo.totalAmountUSDT/gridInfo.gridQuantity
// Function to generate the order chart
function generateOrderChart(gridInfo) {
    const orderChart = {
        buyOrders: [],
        sellOrders: [],
    };

    // Calculate grid interval
    const gridInterval = (gridInfo.upperPrice - gridInfo.lowerPrice) / (gridInfo.gridQuantity);

const orders=[]

  
 for (let i = 0; i < gridInfo.gridQuantity; i++) {
        const buyPrice = (gridInfo.lowerPrice + (gridInterval * (i))).toFixed(5);
        const sellPrice= (gridInfo.lowerPrice + (gridInterval * (i+1))).toFixed(5);
        console.log(buyPrice,gridInfo.amountUsdtPerGrid)
        let order={}
        order.price=buyPrice;
        order.type="buy";
        order.filled=false;
        order.sellPrice=sellPrice;
        order.filledAt=0;
        order.quantity=gridInfo.amountUsdtPerGrid/buyPrice;
        order.filledCount=0;
        
        
        
        if(gridInfo.lastPrice<=Number(order.price))
        {
          order.filled=true;
          order.filledAt=gridInfo.lastPrice;
        }
        orders.push(order)
        console.log(order)
      /*  if (buyPrice >= gridInfo.lowerPrice) {
            const filledAfterPercent = (((gridInfo.lastPrice - buyPrice) / buyPrice) * 100).toFixed(2);
            orderChart.buyOrders.push({
                orderNumber: orderChart.buyOrders.length + 1,
                price: buyPrice,
                filledAfter: filledAfterPercent,
                amount: gridInfo.amountPerGrid.toFixed(2)
            });
        }*/
    }
    // Generate buy orders (below the creation price)
    for (let i = 0; i < gridInfo.gridQuantity; i++) {
        const buyPrice = (gridInfo.lowerPrice + (gridInterval * (i + 1))).toFixed(5);
        //console.log(buyPrice)
        if (buyPrice >= gridInfo.lowerPrice) {
            const filledAfterPercent = (((gridInfo.lastPrice - buyPrice) / buyPrice) * 100).toFixed(2);
            orderChart.buyOrders.push({
                orderNumber: orderChart.buyOrders.length + 1,
                price: buyPrice,
                filledAfter: filledAfterPercent,
                amount: gridInfo.amountPerGrid.toFixed(2)
            });
        }
    }

    // Generate sell orders (above the creation price)
    for (let i = 0; i < gridInfo.gridQuantity / 2; i++) {
        const sellPrice = (gridInfo.creationPrice + (gridInterval * (i + 1))).toFixed(5);
        if (sellPrice <= gridInfo.upperPrice) {
            const filledAfterPercent = (((sellPrice - gridInfo.creationPrice) / gridInfo.creationPrice) * 100).toFixed(2);
            orderChart.sellOrders.push({
                orderNumber: orderChart.sellOrders.length + 1,
                price: sellPrice,
                filledAfter: filledAfterPercent,
                amount: gridInfo.amountPerGrid.toFixed(2)
            });
        }
    }

    return orderChart;
}

// Generate the order chart
const orderChart = generateOrderChart(gridInfo);

// Function to display the order chart
function displayOrderChart(orderChart) {
    console.log("Last price: ", gridInfo.lastPrice);
    console.log("Amount per grid: ", gridInfo.amountPerGrid);
    console.log("Buy orders: ", orderChart.buyOrders.length);
    console.log("Sell orders: ", orderChart.sellOrders.length);

    console.log("\nBuy Orders:");
    orderChart.buyOrders.forEach(order => {
        console.log(`No. ${order.orderNumber} | Price: ${order.price} | Filled after: ${order.filledAfter}% | Amount: ${order.amount} MYRIA`);
    });

    console.log("\nSell Orders:");
    orderChart.sellOrders.forEach(order => {
        console.log(`No. ${order.orderNumber} | Price: ${order.price} | Filled after: ${order.filledAfter}% | Amount: ${order.amount} MYRIA`);
    });
}


// Display the generated order chart
displayOrderChart(orderChart);
