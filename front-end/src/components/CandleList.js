import React from 'react';
import Candle from './Candle';

const CandleList = ({ candles }) => {
  return (
    <div>
      {candles.map(candle => (
        <Candle key={candle.id} candle={candle} />
      ))}
    </div>
  );
};

export default CandleList;