import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/s/:slug" element={<ShopView />} />
        {/* Obsługa domen klienta również kieruje do ShopView */}
        <Route path="*" element={<ShopView />} />
      </Routes>
    </Router>
  );
}

export default App;
