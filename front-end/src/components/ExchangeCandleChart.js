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
            timeScale: { borderColor: '#485c7b' }, 
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
