import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShopView from './components/ShopView';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/s/:slug" element={<ShopView />} />
        {/* Przekierowanie jeśli ktoś wejdzie na stronę główną bez sluga */}
        <Route path="/" element={<div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Wpisz /s/twoj-slug w adresie</div>} />
      </Routes>
    </Router>
  );
}

export default App;
