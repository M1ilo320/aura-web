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
          <div className="home-logo">AURA</div>
          <div className="home-socials">
            <a href="#" className="s-icon">🎮</a>
            <a href="#" className="s-icon">🎵</a>
            <a href="#" className="s-icon">📸</a>
            <a href="#" className="s-icon">📘</a>
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
              </Link>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&display=swap');

        :root { --p: #7e1b3d; --bg: #0b0a0b; }
        * { box-sizing: border-box; font-family: 'Montserrat', sans-serif; }
        body { margin: 0; background: var(--bg); color: #fff; overflow-x: hidden; }

        .home-wrapper { min-height: 100vh; position: relative; }
        .mesh-bg { 
          position: fixed; inset: 0; z-index: -1;
          background: radial-gradient(circle at 50% 50%, #1a060d 0%, #000 100%);
        }

        .home-nav { height: 100px; display: flex; align-items: center; }
        .home-nav-container { width: 100%; max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; padding: 0 60px; }
        .home-logo { font-weight: 900; letter-spacing: 15px; font-size: 28px; color: var(--p); text-shadow: 0 0 30px var(--p); }
        .home-socials { display: flex; gap: 20px; }
        .s-icon { text-decoration: none; font-size: 20px; filter: grayscale(1); transition: 0.3s; opacity: 0.5; }
        .s-icon:hover { filter: grayscale(0); opacity: 1; transform: translateY(-3px); }

        .home-main { padding-top: 50px; display: flex; justify-content: center; }
        .selector-panel { 
          background: #151113; border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 40px; padding: 80px; width: 100%; max-width: 1100px; 
          text-align: center; box-shadow: 0 50px 100px rgba(0,0,0,0.6);
        }
        .selector-panel h1 { font-size: 42px; font-weight: 900; margin-bottom: 10px; letter-spacing: -2px; }
        .selector-panel p { color: #555; font-size: 14px; margin-bottom: 60px; }

        .server-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 25px; }
        .server-card { 
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 25px; padding: 30px; text-decoration: none; transition: 0.4s;
        }
        .server-card:hover { 
          background: rgba(255,255,255,0.05); border-color: var(--p); 
          transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
        .server-icon { height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .server-icon img { max-width: 80px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); }
        .server-name { color: #888; font-size: 11px; font-weight: 900; letter-spacing: 2px; }
        .server-card:hover .server-name { color: #fff; }

        .home-loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--p); letter-spacing: 5px; }
      `}</style>
    </div>
  );
};

export default HomeView;
