import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import ChartPage from './components/ChartPage';
import GridPage from './components/GridPage';

const App = () => {
    return (
        <Router>
            <NavigationBar />
            <div style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chart" element={<ChartPage />} />
                    <Route path="/grid" element={<GridPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
