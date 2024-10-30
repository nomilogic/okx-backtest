import React from 'react';

const Candle = ({ candle }) => {
  return (
    <div className="candle">
      <h2>{candle.name}</h2>
      <p>Price: ${candle.price}</p>
      <p>Color: {candle.color}</p>
    </div>
  );
};

export default Candle;