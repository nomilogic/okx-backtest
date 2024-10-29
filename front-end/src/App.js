import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandleList from './components/CandleList';

const App = () => {
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCandles = async () => {
    try {
      const response = await axios.get('https://api.example.com/candles'); // Replace with your API URL
      setCandles(response.data);
    } catch (err) {
      setError('Failed to fetch candles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandles();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Candle Fetcher</h1>
      <CandleList candles={candles} />
    </div>
  );
};

export default App;
