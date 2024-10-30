// GridBotConfigForm.js
import React, { useState } from 'react';

const GridBotConfigForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        gridType: 'neutral',
        gridCount: 20,
        leverage: 1,
        lowerLimit: '14000',
        upperLimit: '24000',
        initialCapital: 1000,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <select name="gridType" value={formData.gridType} onChange={handleChange}>
                <option value="long">Long</option>
                <option value="short">Short</option>
                <option value="neutral">Neutral</option>
            </select>
            <input type="number" name="gridCount" value={formData.gridCount} onChange={handleChange} placeholder="Number of Grids" />
            <input type="number" name="leverage" value={formData.leverage} onChange={handleChange} placeholder="Leverage" />
            <input type="number" name="lowerLimit" value={formData.lowerLimit} onChange={handleChange} placeholder="Lower Price Limit" />
            <input type="number" name="upperLimit" value={formData.upperLimit} onChange={handleChange} placeholder="Upper Price Limit" />
            <input type="number" name="initialCapital" value={formData.initialCapital} onChange={handleChange} placeholder="Initial Capital" />
            <button type="submit">Start Backtest</button>
        </form>
    );
};

export default GridBotConfigForm;
