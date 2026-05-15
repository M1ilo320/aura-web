import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShopView from './components/ShopView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ShopView />} />
        <Route path="/s/:slug" element={<ShopView />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
