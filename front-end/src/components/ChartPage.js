import React, { useState } from 'react';
import axios from 'axios';
import DataForm from './DataForm';
import ExchangeCandleChart from './ExchangeCandleChart';

const ChartPage = () => {
    const [chartData, setChartData] = useState(null);

    const fetchData = async (params) => {
        try {
            const response = await axios.get('http://localhost:3000/fetch-candle-data', { params });
            const sortedData = response.data.data.sort((a, b) => a.time - b.time);
            console.log(response.data.data, sortedData)
            
            const formattedData = sortedData.map(candle => ({
                time: new Date(candle.timestamp).getTime() / 1000, // convert to seconds for chart compatibility
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close
            }));
            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h2>Chart</h2>
            <DataForm onFetchData={fetchData} />
            <ExchangeCandleChart data={chartData} />
        </div>
    );
};

export default ChartPage;
