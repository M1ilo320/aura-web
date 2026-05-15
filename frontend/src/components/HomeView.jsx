import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeView = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";

  useEffect(() => {
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&display=swap');

        :root { --p: #C9CED6; --bg: #0b0a0b; --card-bg: #151113; }
        * { box-sizing: border-box; font-family: 'Montserrat', sans-serif; }
        body { margin: 0; background: var(--bg); color: #fff; overflow-x: hidden; }

        .home-wrapper { min-height: 100vh; position: relative; }
        .mesh-bg { 
          position: fixed; inset: 0; z-index: -1;
          background: radial-gradient(circle at 50% 50%, #202225 0%, #000 100%);
          opacity: 0.8;
        }

        .home-nav { height: 100px; display: flex; align-items: center; }
        .home-nav-container { width: 100%; max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 60px; }
        .home-logo { height: 60px; display: flex; align-items: center; }
        .home-logo img { height: 100%; width: auto; filter: drop-shadow(0 0 15px rgba(201, 206, 214, 0.2)); }
        .home-socials { display: flex; gap: 20px; }
        .s-icon { text-decoration: none; font-size: 20px; transition: 0.3s; opacity: 0.4; filter: grayscale(1); }
        .s-icon:hover { opacity: 1; filter: grayscale(0); transform: translateY(-3px); }

        .home-main { padding: 40px 20px; display: flex; justify-content: center; }
        .selector-panel { 
          background: #161618; border: 2px solid #C9CED6; 
          border-radius: 40px; padding: 80px 60px; width: 100%; max-width: 1100px; 
          text-align: center; box-shadow: 0 50px 100px rgba(0,0,0,0.8);
          position: relative; overflow: hidden;
        }
        .selector-panel::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, #C9CED6, transparent);
        }

        .selector-panel h1 { font-size: 48px; font-weight: 900; margin-bottom: 10px; letter-spacing: -2px; color: #fff; }
        .selector-panel p { color: #666; font-size: 14px; margin-bottom: 60px; }

        .server-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .server-card { 
          background: #1a1a1c; border: 1px solid rgba(201, 206, 214, 0.3); 
          border-radius: 30px; padding: 40px 20px; text-decoration: none; transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .server-card:hover { 
          background: #1e1e21; border-color: #fff; 
          transform: translateY(-10px); box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
        .server-icon { height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; transition: 0.3s; }
        .server-icon img { max-width: 90px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5)); }
        .server-card:hover .server-icon { transform: scale(1.1); }

        .server-name { color: #fff; font-size: 14px; font-weight: 900; letter-spacing: 1px; margin-bottom: 8px; }
        .server-status { color: #444; font-size: 9px; font-weight: 800; letter-spacing: 2px; transition: 0.3s; }
        .server-card:hover .server-status { color: var(--p); }

        .home-loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--p); letter-spacing: 5px; }
      `}</style>
    </div>
  );
};

export default HomeView;
