// StrategyForm.js
import React, { useState } from 'react';

const StrategyForm = ({ onChange }) => {
    const [strategyData, setStrategyData] = useState({
        long: false,
        short: false,
        neutral: false,
        priceRange: '',
        lowerLimit: '',
        entryPrice:'',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setStrategyData({ ...strategyData, [name]: newValue });
        onChange(strategyData);
    };

    return (
        <form style={{ marginBottom: '1rem' }}>
            <label>
                Long
                <input type="checkbox" name="long" checked={strategyData.long} onChange={handleChange} />
            </label>
            <label>
                Short
                <input type="checkbox" name="short" checked={strategyData.short} onChange={handleChange} />
            </label>
            <label>
                Neutral
                <input type="checkbox" name="neutral" checked={strategyData.neutral} onChange={handleChange} />
            </label>
            <label>
                Price Range (USDT)
                <input type="text" name="priceRange" value={strategyData.priceRange} onChange={handleChange} />
            </label>
            <label>
                Lower Limit
                <input type="text" name="lowerLimit" value={strategyData.lowerLimit} onChange={handleChange} />
            </label>
            <label>
                Entry Price
                <input type="text" name="entryPrice" value={strategyData.entryPrice} onChange={handleChange} />
            </label>
        </form>
    );
};

export default StrategyForm;
