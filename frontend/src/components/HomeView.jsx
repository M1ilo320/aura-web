import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeView.css';

const HomeView = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";

  useEffect(() => {
    document.title = "AuraStore - Wybierz Serwer";
    fetch(`${BACKEND_URL}/api/shops`)
      .then(res => res.json())
      .then(data => {
        setShops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch shops error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="home-loading">WCZYTYWANIE SIECI SERWERÓW...</div>;

  return (
    <div className="home-wrapper">
      <div className="mesh-bg"></div>

      <nav className="home-nav">
        <div className="home-nav-container">
          <div className="home-logo">
            <img src="/aura_logo.png" alt="AURA" />
          </div>
          <div className="home-socials">
            <a href="https://discord.gg/PMr6rJWsjx" target="_blank" rel="noreferrer" className="s-icon" title="Discord">🎮</a>
            <a href="https://tiktok.com/@TWOJ-LINK" target="_blank" rel="noreferrer" className="s-icon" title="TikTok">🎵</a>
            <a href="https://instagram.com/TWOJ-LINK" target="_blank" rel="noreferrer" className="s-icon" title="Instagram">📸</a>
            <a href="https://facebook.com/TWOJ-LINK" target="_blank" rel="noreferrer" className="s-icon" title="Facebook">📘</a>
          </div>
        </div>
      </nav>

      <main className="home-main">
        <div className="selector-panel">
          <h1>Wybierz serwer</h1>
          <p>Nie ma Twojego serwera na liście? Użyj bezpośredniego linku do sklepu!</p>

          <div className="server-grid">
            {shops.map(shop => (
              <Link key={shop.id} to={`/s/${shop.slug}`} className="server-card">
                <div className="server-icon">
                  <img src={shop.logo_url || "https://i.imgur.com/8YvLh8f.png"} alt="logo" />
                </div>
                <div className="server-name">{shop.name.toUpperCase()}</div>
                <div className="server-status">DOŁĄCZ DO GRY</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeView;
