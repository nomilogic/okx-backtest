import React, { useState } from 'react';
import axios from 'axios';
import DataForm from './DataForm';
import ExchangeCandleChart from './ExchangeCandleChart';

const ChartPage = () => {
    const [chartData, setChartData] = useState(null);

    const fetchData = async (params) => {
        try {
            const response = await axios.get('http://localhost:3000/fetch-candle-data', { params });
            const sortedData = response.data.data
            console.log(sortedData)
            //.sort((a, b) => a.timestamp - b.timestamp);
           // console.log(response.data.data, sortedData)
            
            const formattedData = sortedData.map(candle => ({
                time:candle.timestamp/1000, // convert to seconds for chart compatibility
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close)
            })).sort((a, b) => a.time - b.time);;
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
