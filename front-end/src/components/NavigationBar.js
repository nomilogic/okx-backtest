import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
    return (
        <nav style={{ backgroundColor: '#333', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Exchange Candle Chart</h2>
            <div>
                <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>Home</Link>
                <Link to="/chart" style={{ color: '#fff', marginRight: '1rem' }}>Chart</Link>
                <Link to="/grid" style={{ color: '#fff' }}>Grid</Link>
            </div>
        </nav>
    );
};

export default NavigationBar;
