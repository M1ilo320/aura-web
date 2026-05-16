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
            <a href="https://discord.gg/PMr6rJWsjx" target="_blank" rel="noreferrer" className="s-icon discord" title="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" /></svg>
            </a>
            <a href="https://tiktok.com/@TWOJ-LINK" target="_blank" rel="noreferrer" className="s-icon tiktok" title="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.34-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.36-.54.38-.89.98-1.03 1.64-.13.47-.12.95-.04 1.42.18.97.88 1.83 1.8 2.19.77.31 1.64.33 2.43.05.7-.22 1.31-.72 1.63-1.36.19-.38.31-.79.35-1.22.03-1.91-.01-3.83-.01-5.74V.02z" /></svg>
            </a>
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
                <div className="server-name-badge">{shop.name.toUpperCase()}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeView;
