import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import ShopView from './components/ShopView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/s/:slug" element={<ShopView />} />
        <Route path="/" element={<div className="home-msg">AuraStore Platform - Znajdź sklep swojego serwera.</div>} />
      </Routes>
    </Router>
  );
}

export default App;
