import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShopView from './components/ShopView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/s/:slug" element={<ShopView />} />
        <Route path="/" element={<div style={{color: 'white', padding: '50px', textAlign: 'center'}}>AuraStore SaaS - Podaj slug sklepu w URL</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
