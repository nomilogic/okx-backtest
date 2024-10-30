// Grid.js
import React from 'react';

const Grid = ({ data }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                </tr>
            </thead>
            <tbody>
                {data.map((candle, index) => (
                    <tr key={index}>
                        <td>{new Date(candle.time * 1000).toLocaleString()}</td>
                        <td>{candle.open}</td>
                        <td>{candle.high}</td>
                        <td>{candle.low}</td>
                        <td>{candle.close}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Grid;
