// ExchangeCandleGridChart.js
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const ExchangeCandleGridChart = ({ data, gridLevels, transactions }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleSeriesRef = useRef(null);

    useEffect(() => {
        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,  
            height: 400,  
            layout: { backgroundColor: '#131722', textColor: '#000' },  
            grid: {  
                vertLines: {  
                    color: '#363c4e',  
                    style: 0,  
                    visible: true,  
                    width: 1,  
                },  
                horzLines: {  
                    color: '#363c4e',  
                    style: 0,  
                    visible: true,  
                    width: 1,  
                },  
            },  
            priceScale: {  
                visible: true,  
                borderColor: '#485c7b', 
                textColor:'#f44336' ,
                tickMarkFormatter: (price) => `$${price.toFixed(8)}`,  
                position: 'right', // 'left' to place it on the left  
            },  
            timeScale: {  
                borderColor: '#f44336',  
                timeVisible: true,  
                secondsVisible: false,  
                textColor:'#000000' ,

                tickMarkFormatter: (time) => {  
                    const date = new Date(time * 1000);  
                    return date.toLocaleTimeString([], { hour12: false, hour: 'numeric', minute: '2-digit', year: '2-digit', month: 'numeric', day: 'numeric', timeZone: 'UTC'});  
                },  
            },  
        });

        candleSeriesRef.current = chartRef.current.addCandlestickSeries();
        if (data) {
            // Convert data properties to numbers and sort by time
            const formattedData = data
              
            candleSeriesRef.current.setData(formattedData);
        }
        // Draw grid levels
        if (null != gridLevels && gridLevels.length > 0) {
            gridLevels.forEach((level) => {
                chartRef.current.addLineSeries({
                    priceLineVisible: true,
                    lineWidth: 1,
                    price: level,
                });
            });

            // Mark transactions
            transactions.forEach((tx) => {
                candleSeriesRef.current.setMarkers([
                    { time: new Date(tx.timestamp).getTime() / 1000, position: 'aboveBar', color: tx.type === 'buy' ? 'green' : 'red', shape: 'arrowUp' },
                ]);
            });

        }
        return () => chartRef.current.remove();

    }, [data, gridLevels, transactions]);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default ExchangeCandleGridChart;
