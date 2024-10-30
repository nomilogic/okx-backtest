import React, { useState } from 'react';

const DataForm = ({ onFetchData }) => {
    const [formData, setFormData] = useState({
        instId: 'BTC-USDT-SWAP',
        bar: '1m',
        afterDateTime: '01-01-2023 00:00',
        beforeDateTime: '01-01-2023 01:00',
        waitTime: '1000',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFetchData(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <input type="text" name="instId" value={formData.instId} onChange={handleChange} placeholder="Instrument ID" />
            <input type="text" name="bar" value={formData.bar} onChange={handleChange} placeholder="Bar (e.g., 1m)" />
            <input type="text" name="afterDateTime" value={formData.afterDateTime} onChange={handleChange} placeholder="After Date" />
            <input type="text" name="beforeDateTime" value={formData.beforeDateTime} onChange={handleChange} placeholder="Before Date" />
            <input type="text" name="waitTime" value={formData.waitTime} onChange={handleChange} placeholder="Wait Time (ms)" />
            <button type="submit">Fetch Data</button>
        </form>
    );
};

export default DataForm;
