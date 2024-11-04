import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const ExchangeCandleChart = ({ data }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      autoScale: true,
      layout: { backgroundColor: "#131722", textColor: "#00ff" },
      grid: {
        vertLines: { color: "#363c4e" },
        horzLines: { color: "#363c4e" },
      },

      timeScale: {
        borderColor: "#f44336",
        timeVisible: true, // Show time on x-axis
        secondsVisible: true, // Hide seconds, show only hours and minutes
        /* tickMarkFormatter: (time) => {  
                     const date = new Date(time * 1000); // Convert from seconds to milliseconds  
                     const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
                     return date.toLocaleString('en-US', options); // Customize format as needed
                 },   */
      },
    });
    chartRef.current.priceScale("right").applyOptions({
      ticksVisible: true,
      textColor: "#00ff",
      scaleMargins: {
        top: 0.000002,
        bottom: 0.0000002,
      },
    });
    chartRef.current.timeScale().applyOptions({
      borderColor: "#00FF",
      visible: true,
      dateVisible: true,
      autoScale: true,
    });

    // Apply the custom priceFormatter to the chart

    const numberLength = (num) =>
      num.toString().replace(".", "").replace("-", "").length;
    if (data) {
      let numberLength = 0;
      if (data[0] && data[0].open < 1) {
        numberLength =
          1 +
          "0".repeat(
            data[0].open
              .toExponential()
              .split(".")[1]
              .split("e-")
              .reduce((a, b) => {
                return a.length + Number(b);
              })
          );
        console.log(numberLength);
        //`  const lineData = data.map(e=>{return {price : e.close}}),
        const lineData = data.map((datapoint) => ({
          time: datapoint.time,
          value: (datapoint.close + datapoint.open) / 2,
        }));

        const lineSeries=chartRef.current.addLineSeries({
          priceFormat: {
            minMove: 1 / Number(numberLength),
          },
        });
        lineSeries.setData(lineData);   
      }
      
      const formattedData = data;
      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: "#4caf50",
        downColor: "#f44336",
        borderDownColor: "#f44336",
        borderUpColor: "#4caf50",
        wickDownColor: "#f44336",
        wickUpColor: "#4caf50",
      });
      candleSeriesRef.current.setData(formattedData);
    }

    return () => chartRef.current.remove();
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default ExchangeCandleChart;
