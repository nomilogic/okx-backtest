// BacktestGridBot.js
import React, { useState, useEffect } from 'react';

const BacktestGridBot = ({ config, priceData }) => {
    console.log(config, priceData)
    const [gridLevels, setGridLevels] = useState([]);
    const [position, setPosition] = useState({ open: 0, profit: 0 });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (config) setupGrids();

        console.log(config)
    }, [config]);

    const setupGrids = () => {
        const { lowerLimit, upperLimit, gridCount } = config;
        const gridSize = (upperLimit - lowerLimit) / gridCount;
        console.log(lowerLimit, upperLimit, gridCount, gridSize)
        const levels = Array.from({ length: gridCount + 1 }, (_, i) => Number(lowerLimit) + Number(i) * gridSize);

        setGridLevels(levels);
        console.log(gridLevels)

    };
   /*  useEffect(() => {
        console.log(gridLevels);
    }, [gridLevels]); */
    const runBacktest = () => {
        let virtualBalance = Number(config.initialCapital);
        let currentPosition = 0;
        const newTransactions = [];

        for (const pricePoint of priceData) {
            gridLevels.forEach((level) => {
                if (pricePoint.close <= level && config.gridType === 'long') {
                    const amount = (virtualBalance / level) * config.leverage;
                    newTransactions.push({ type: 'buy', price: level, amount });
                    virtualBalance -= amount * level; // Deduct cost from balance
                } else if (pricePoint.close >= level && config.gridType === 'short') {
                    const amount = (virtualBalance / level) * config.leverage;
                    newTransactions.push({ type: 'sell', price: level, amount });
                    virtualBalance += amount * level; // Add to balance for short
                }
            });
            console.log(newTransactions)
            // Update current position
            currentPosition = virtualBalance + currentPosition;
        }

        setTransactions(newTransactions);
        setPosition({ open: currentPosition, profit: currentPosition - config.initialCapital });
    };

    useEffect(() => {
        console.log(gridLevels)
        if (gridLevels.length > 0 && priceData.length > 0) runBacktest();
    }, [gridLevels, priceData]);

    return (
        <div>
            <h3>Backtest Results</h3>
            <p>Open Position: {position.open.toFixed(10)}</p>
            <p>Total P&L: {position.profit.toFixed(10)}</p>
            <ul>
                {transactions.map((tx, idx) => (
                    <li key={idx}>{`${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} at ${tx.price.toFixed(2)}, Amount: ${tx.amount.toFixed(2)}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default BacktestGridBot;
