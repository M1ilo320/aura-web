import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Wykrywanie logowania
    const params = new URLSearchParams(window.location.search);
    const steamid = params.get('steamid');
    if (steamid) {
      localStorage.setItem('aura_steamid', steamid);
      setUserData({ steamid });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const saved = localStorage.getItem('aura_steamid');
      if (saved) setUserData({ steamid: saved });
    }

    const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";
    fetch(`${BACKEND_URL}/api/shops`)
      .then(res => res.json())
      .then(data => setShops(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aura_steamid');
    setUserData(null);
  };

  return (
    <div className="home-wrapper">
      <div className="top-nav-home">
        {userData ? (
          <div className="user-info-home">
            <span>ID: {userData.steamid.substring(0, 8)}..</span>
            <button onClick={handleLogout}>WYLOGUJ</button>
          </div>
        ) : (
          <div className="guest-info">Zaloguj się w sklepie, aby kupować!</div>
        )}
      </div>
      <div className="wave-bg"></div>
      <div className="container">
        <header className="home-header">
          <h1>Wybierz serwer</h1>
          <p>Nie ma Twojego serwera na liście? Użyj bezpośredniego linku do sklepu!</p>
        </header>


        <div className="server-grid">
          {shops.map(shop => (
            <div key={shop.slug} className="server-card" onClick={() => navigate(`/s/${shop.slug}`)}>
              <div className="server-logo">
                {shop.logo_url ? <img src={shop.logo_url} alt="" /> : <div className="logo-placeholder">🏢</div>}
              </div>
              <div className="server-name">{shop.name.toUpperCase()}</div>
              <div className="hover-line" style={{background: shop.accent_color}}></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .home-wrapper { min-height: 100vh; background: #0b0d14; color: white; font-family: 'Outfit', 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; padding: 100px 20px 40px; position: relative; overflow: hidden; }
        .top-nav-home { position: absolute; top: 30px; right: 40px; z-index: 10; }
        .user-info-home { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); padding: 10px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 800; }
        .user-info-home button { background: transparent; border: none; color: #ff4444; font-weight: 900; cursor: pointer; font-size: 10px; }
        .guest-info { font-size: 10px; color: #444; font-weight: 800; letter-spacing: 1px; }

        .wave-bg { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%); z-index: 1; }
        
        .container { max-width: 900px; width: 100%; background: #141721; border-radius: 40px; padding: 60px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 40px 100px rgba(0,0,0,0.5); position: relative; z-index: 2; }
        
        .home-header { text-align: center; margin-bottom: 60px; }
        .home-header h1 { font-size: 48px; font-weight: 950; margin: 0; letter-spacing: -3px; background: linear-gradient(to right, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .home-header p { color: #555866; margin-top: 15px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; }

        .server-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .server-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 35px 25px; text-align: center; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; overflow: hidden; }
        .server-card:hover { transform: translateY(-12px); background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        
        .hover-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; transform: scaleX(0); transition: 0.3s; }
        .server-card:hover .hover-line { transform: scaleX(1); }

        .server-logo { width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
        .server-logo img { max-width: 60%; max-height: 60%; object-fit: contain; filter: drop-shadow(0 0 10px rgba(255,255,255,0.1)); }
        .logo-placeholder { font-size: 40px; opacity: 0.2; }
        .server-name { font-size: 12px; font-weight: 900; color: #fff; letter-spacing: 1px; opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default Home;
