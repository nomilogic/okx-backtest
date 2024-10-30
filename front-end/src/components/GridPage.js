// GridPage.js
import React, { useState } from 'react';
import GridBotConfigForm from './GridBotConfigForm';
import BacktestGridBot from './BacktestGridBot';
import ExchangeCandleGridChart from './ExchangeCandleGridChart'; // import your existing chart component
import DataForm from './DataForm';
import axios from 'axios';

const GridPage = () => {
    const [config, setConfig] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);

    const fetchHistoricalData = async (params) => {
        // Fetch your data using API call (example: axios.get('/api/historical-data', { params: { symbol, afterDate, beforeDate } }))
        // Assuming historicalData fetched is [{ time, open, high, low, close }, ...]

        try {
            const response = await axios.get('http://localhost:3000/fetch-candle-data', { params });
            const sortedData = response.data.data.sort((a, b) => a.time - b.time);
            console.log(response.data.data, sortedData)
            
            const formattedData = sortedData.map(candle => ({
                time:candle.timestamp/1000, // convert to seconds for chart compatibility
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close)
            })).sort((a, b) => a.time - b.time);;
            //setChartData(formattedData);
             setHistoricalData(formattedData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleConfigSubmit = (configData) => {
        setConfig(configData);
        console.log(config);
       // fetchHistoricalData(configData.symbol, configData.afterDate, configData.beforeDate);
    };

    return (
        <div>
            <h2>Grid Bot Backtesting</h2>
            <DataForm onFetchData={fetchHistoricalData} />
            <GridBotConfigForm onSubmit={handleConfigSubmit} />
            
            {config && historicalData.length > 0 && (
                <>
                    <ExchangeCandleGridChart data={historicalData} gridLevels={config.gridLevels} />
                    <BacktestGridBot config={config} priceData={historicalData} />
                </>
            )}
        </div>
    );
};

export default GridPage;
