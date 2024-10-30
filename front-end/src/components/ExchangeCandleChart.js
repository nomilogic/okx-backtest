import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const ExchangeCandleChart = ({ data }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleSeriesRef = useRef(null);

    useEffect(() => {
        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: { backgroundColor: '#131722', textColor: '#d1d4dc' },
            grid: { vertLines: { color: '#363c4e' }, horzLines: { color: '#363c4e' } },
            priceScale: { borderColor: '#485c7b' },
            timeScale: {   
                borderColor: '#f44336',  
                timeVisible: true, // Show time on x-axis  
                secondsVisible: false, // Hide seconds, show only hours and minutes  
                tickMarkFormatter: (time) => {  
                    const date = new Date(time * 1000); // Convert from seconds to milliseconds  
                    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
                    return date.toLocaleString('en-US', options); // Customize format as needed
                },  
                
            },  
        });

        candleSeriesRef.current = chartRef.current.addCandlestickSeries({
            upColor: '#4caf50',
            downColor: '#f44336',
            borderDownColor: '#f44336',
            borderUpColor: '#4caf50',
            wickDownColor: '#f44336',
            wickUpColor: '#4caf50',
        });

        if (data) {
            
            const formattedData = data  
            candleSeriesRef.current.setData(formattedData);
        }

        return () => chartRef.current.remove();
    }, [data]);

    return (
        <div
            ref={chartContainerRef}
            style={{ position: 'relative', width: '100%', height: '400px' }}
        />
    );
};

export default ExchangeCandleChart; 
