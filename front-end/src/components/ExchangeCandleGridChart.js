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
            layout: { backgroundColor: '#131722', textColor: '#d1d4dc' },
            grid: { vertLines: { color: '#363c4e' }, horzLines: { color: '#363c4e' } },
            priceScale: { borderColor: '#485c7b' },
            timeScale: { borderColor: '#485c7b' },
        });

        candleSeriesRef.current = chartRef.current.addCandlestickSeries();
        if (data) {
            // Convert data properties to numbers and sort by time
            const formattedData = data
                .map(item => ({
                    ...item,
                    time: parseInt(item.time, 10),
                    open: parseFloat(item.open),
                    high: parseFloat(item.high),
                    low: parseFloat(item.low),
                    close: parseFloat(item.close),
                }))
                .sort((a, b) => a.time - b.time); // Sort in ascending order by time

            candleSeriesRef.current.setData(formattedData);
        }
        // Draw grid levels
        if(null!=gridLevels && gridLevels.length>0)
        {gridLevels.forEach((level) => {
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
