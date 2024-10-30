const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const axios = require('axios');
const cors = require('@fastify/cors');

fastify.register(cors, {
    // Define your CORS options here
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
});
 
// Convert a datetime string (dd-mm-yyyy HH:mm) to a timestamp
function dateTimeToTimestamp(dateTimeStr) {
    const [dateStr, timeStr] = dateTimeStr.split(' ');
    const [day, month, year] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.getTime();
}

// Create a delay
async function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Write JSON data to a file
function writeJsonToFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filename}`);
}

// Fetch data from the API in batches
async function fetchCandleData(instId, bar, afterDateTimeStr, beforeDateTimeStr, waitTime) {
    const after = dateTimeToTimestamp(afterDateTimeStr);
    const before = dateTimeToTimestamp(beforeDateTimeStr);

    let allCandleData = [];
    let nextBatchStart = before;

    while (nextBatchStart > after) {
        await wait(waitTime); // Wait for the specified time

        const url = `https://www.okx.com/api/v5/market/history-mark-price-candles?instId=${instId}&bar=${bar}&before=${after}&after=${nextBatchStart}&limit=300`;
        console.log(url);
        const response = await axios.get(url);
        const candles = response.data.data;

        if (candles.length === 0) {
            break; // Exit loop if no more data is returned
        }

        allCandleData = allCandleData.concat(candles.map(candle => ({
            "timestamp": parseInt(candle[0]),
            "open": candle[1],
            "high": candle[2],
            "low": candle[3],
            "close": candle[4],
            "volume": candle[5]
        })));
        //break;
        nextBatchStart = parseInt(candles[candles.length - 1][0]);
    }

    // Format data for output
    const candleData = {
        "instrument": instId,
        "interval": bar,
        "data": allCandleData
    };

    // Save data to a file with a dynamic filename
    const filename = `candle_data_${instId}_${bar}_${Date.now()}.json`;
    writeJsonToFile(filename, candleData);

    return candleData;
}

// Define Fastify routes
fastify.post('/fetch-candle-data', async (request, reply) => {
    const { instId, bar, afterDateTime, beforeDateTime, waitTime } = request.body;

    try {
        const data = await fetchCandleData(instId, bar, afterDateTime, beforeDateTime, waitTime);
        reply.send(data);
    } catch (error) {
        fastify.log.error('Error fetching candle data:', error);
        reply.status(500).send({ error: error.message });
    }
});

// GET route for fetching candle data
fastify.get('/fetch-candle-data', async (request, reply) => {
    const { instId, bar, afterDateTime, beforeDateTime, waitTime } = request.query;

    try {
        const data = await fetchCandleData(instId, bar, afterDateTime, beforeDateTime, parseInt(waitTime) || 0);
        console.log(data.data.length)
        reply.send(data);
    } catch (error) {
        fastify.log.error('Error fetching candle data:', error);
        reply.status(500).send({ error: error.message });
    }
});

// Start the Fastify server
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        fastify.log.info(`Server is running at http://localhost:3000`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
