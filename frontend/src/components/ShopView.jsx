import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug: urlSlug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('WSZYSTKO');
  const [userData, setUserData] = useState(null);

  const getSlug = () => {
    if (urlSlug) return urlSlug;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return 'plugrp';
    return hostname.split('.')[0];
  };

  const currentSlug = getSlug();

  useEffect(() => {
    // Sprawdź czy w linku jest steamid (powrót z logowania)
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
  }, []);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";
    
    const fetchData = () => {
      if (!currentSlug) return;
      fetch(`${BACKEND_URL}/api/shop/${currentSlug}`)
        .then(res => res.json())
        .then(json => {
          if (json.shop) {
            setData(json);
            document.documentElement.style.setProperty('--primary', json.shop.accent_color || '#a855f7');
          } else {
            setData(prev => ({ ...prev, shop: null }));
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [currentSlug]);

  const handleSteamLogin = () => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";
    // Przekazujemy origin (np. https://aurastore.com.pl), żeby backend wiedział gdzie wrócić
    const origin = window.location.origin;
    window.location.href = `${BACKEND_URL}/api/auth/steam?origin=${encodeURIComponent(origin)}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_steamid');
    setUserData(null);
  };

  if (loading) return <div className="loading">Wczytywanie...</div>;
  
  if (!data.shop) return (
    <div className="loading" style={{flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '20px'}}>
      <div style={{fontSize: '60px'}}>🏗️</div>
      <div style={{fontSize: '24px', fontWeight: '800'}}>SKLEP W BUDOWIE</div>
      <div style={{color: '#888', maxWidth: '400px'}}>
        Nie znaleźliśmy sklepu o nazwie <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{currentSlug}</span>. 
        Jeśli to Twój sklep, upewnij się że dodałeś go do bazy danych.
      </div>
      <a href="/" style={{color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', marginTop: '20px'}}>Odśwież stronę</a>
    </div>
  );

  const categories = ['WSZYSTKO', ...new Set(data.products.map(p => p.category?.toUpperCase() || 'INNE'))];
  const filteredProducts = activeCategory === 'WSZYSTKO' 
    ? data.products 
    : data.products.filter(p => (p.category?.toUpperCase() || 'INNE') === activeCategory);

  const { shop, recent, onlinePlayers } = data;

  return (
    <div className="app-wrapper">
      <div className="top-line"></div>
      <div className="wave-bg"></div>
      
      <div className="main-container">
        <nav className="top-navbar">
          <div className="logo-section">
            <div className="shop-name">{shop.name.toUpperCase()}</div>
            <div className="online-tag"><span className="dot"></span> {onlinePlayers} GRACZY ONLINE</div>
          </div>
          <div className="nav-actions">
            <button className="nav-link">GŁÓWNA</button>
            {userData ? (
              <div className="logged-user">
                <span className="steam-id">ID: {userData.steamid.substring(0, 8)}..</span>
                <button className="logout-btn" onClick={handleLogout}>WYLOGUJ</button>
              </div>
            ) : (
              <button className="login-btn" onClick={handleSteamLogin}>ZALOGUJ PRZEZ STEAM</button>
            )}
          </div>
        </nav>

        <header className="shop-header">
          <span className="pre-title">OFICJALNY SKLEP SERWERA</span>
          <h1>Szybko i bezpiecznie</h1>
          <p>Wspieraj rozwój serwera i zyskaj unikalne korzyści w grze. Wszystkie pakiety są dostarczane automatycznie.</p>
        </header>

        <div className="hero-slider">
          <div className="slide-content">
            <div className="slide-info">
              <span className="badge">POLECANE PRZEZ ADMINISTRACJĘ</span>
              <h2>PAKIET VIP PRESTIGE</h2>
              <p>Zyskaj dostęp do ekskluzywnych aut, priorytetu w kolejce oraz unikalnego koloru na czacie przez 30 dni.</p>
              <div className="slide-actions">
                <button className="buy-btn">ZOBACZ WIĘCEJ</button>
                <span className="slide-price">49.99 PLN</span>
              </div>
            </div>
            <div className="slide-img">💎</div>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={activeCategory === cat ? 'active' : ''} 
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(p => (
            <div key={p.id} className="small-card">
              <div className="card-icon">📦</div>
              <div className="card-cat">{p.category || 'INNE'}</div>
              <h3>{p.name}</h3>
              <div className="card-footer">
                <span className="price">{p.price} PLN</span>
                <button className="add-btn">+</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="shop-footer">
          <div className="footer-line"></div>
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">{shop.name}</div>
              <p>© 2024 AuraStore SaaS. Wszystkie prawa zastrzeżone.</p>
            </div>
            <div className="footer-links">
              <a href="#">Kontakt</a>
              <a href="#">Regulamin</a>
              <a href="#">Polityka prywatności</a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        :root { --primary: #a855f7; --bg: #0b0d14; --card: #141721; --text: #ffffff; --text-muted: #555866; }
        * { box-sizing: border-box; }
        body { background: var(--bg); color: var(--text); font-family: 'Outfit', 'Inter', sans-serif; margin: 0; }
        
        .app-wrapper { min-height: 100vh; position: relative; overflow-x: hidden; }
        .top-line { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, var(--primary), transparent); z-index: 10; }
        .wave-bg { 
          position: fixed; inset: 0; z-index: -1;
          background: radial-gradient(circle at 10% 10%, rgba(168, 85, 247, 0.04) 0%, transparent 40%),
                      radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.04) 0%, transparent 40%);
          background-color: var(--bg);
        }

        .main-container { max-width: 900px; margin: 0 auto; padding: 0 20px 100px; }

        .top-navbar { height: 110px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .shop-name { font-size: 24px; font-weight: 900; letter-spacing: -1.5px; background: linear-gradient(to right, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .online-tag { font-size: 10px; color: var(--text-muted); font-weight: 800; display: flex; align-items: center; gap: 8px; margin-top: 4px; letter-spacing: 1px; }
        .online-tag .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 12px rgba(34,197,94,0.6); }
        
        .nav-actions { display: flex; align-items: center; gap: 30px; }
        .nav-link { background: transparent; border: none; color: #888; font-size: 11px; font-weight: 800; cursor: pointer; transition: 0.3s; letter-spacing: 1px; }
        .nav-link:hover { color: white; }
        .login-btn { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 12px 24px; border-radius: 14px; font-weight: 900; font-size: 11px; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
        .login-btn:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); border-color: var(--primary); }

        .logged-user { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); padding: 8px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .steam-id { font-size: 10px; color: var(--primary); font-weight: 900; }
        .logout-btn { background: transparent; border: none; color: #ff4444; font-size: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .logout-btn:hover { opacity: 0.7; }

        .shop-header { text-align: center; margin-bottom: 70px; margin-top: 50px; }
        .pre-title { color: var(--primary); font-size: 10px; font-weight: 900; letter-spacing: 3px; display: block; margin-bottom: 15px; }
        .shop-header h1 { font-size: 42px; font-weight: 950; margin: 0; letter-spacing: -2px; line-height: 1.1; }
        .shop-header p { color: var(--text-muted); font-size: 16px; margin: 20px auto 0; font-weight: 500; max-width: 500px; line-height: 1.6; }

        .hero-slider { background: var(--card); border: 1px solid rgba(255,255,255,0.04); border-radius: 35px; padding: 50px; margin-bottom: 60px; position: relative; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.4); }
        .hero-slider::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, var(--primary) -250%, transparent 100%); opacity: 0.15; }
        .slide-content { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2; }
        .badge { background: var(--primary); font-size: 9px; font-weight: 900; padding: 6px 14px; border-radius: 10px; letter-spacing: 0.8px; box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3); }
        .slide-info h2 { font-size: 32px; margin: 15px 0; font-weight: 950; letter-spacing: -1.5px; }
        .slide-info p { color: #8a8d9b; font-size: 15px; margin-bottom: 35px; line-height: 1.7; max-width: 380px; }
        .slide-actions { display: flex; align-items: center; gap: 30px; }
        .slide-price { font-size: 24px; font-weight: 900; color: #fff; opacity: 0.8; }
        .buy-btn { background: var(--primary); border: none; color: white; padding: 16px 35px; border-radius: 16px; font-weight: 950; cursor: pointer; transition: 0.4s; box-shadow: 0 15px 30px rgba(168, 85, 247, 0.25); font-size: 13px; }
        .buy-btn:hover { transform: translateY(-5px) scale(1.02); filter: brightness(1.1); box-shadow: 0 20px 40px rgba(168, 85, 247, 0.4); }
        .slide-img { font-size: 100px; filter: drop-shadow(0 0 30px var(--primary)); opacity: 0.6; transform: rotate(10deg); }

        .category-tabs { display: flex; gap: 12px; margin-bottom: 50px; overflow-x: auto; padding-bottom: 20px; justify-content: center; }
        .category-tabs::-webkit-scrollbar { height: 4px; }
        .category-tabs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .category-tabs button { background: transparent; border: 1px solid transparent; color: var(--text-muted); padding: 12px 24px; border-radius: 16px; font-weight: 900; font-size: 12px; cursor: pointer; transition: 0.3s; white-space: nowrap; letter-spacing: 0.5px; }
        .category-tabs button:hover { color: #fff; background: rgba(255,255,255,0.02); }
        .category-tabs button.active { background: rgba(255,255,255,0.04); color: white; border-color: rgba(255,255,255,0.08); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px; }
        .small-card { background: var(--card); border: 1px solid rgba(255,255,255,0.04); border-radius: 24px; padding: 30px; transition: 0.4s; position: relative; overflow: hidden; }
        .small-card:hover { border-color: var(--primary); transform: translateY(-10px); box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .card-icon { width: 50px; height: 50px; background: rgba(255,255,255,0.02); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; font-size: 22px; border: 1px solid rgba(255,255,255,0.06); }
        .card-cat { font-size: 10px; color: var(--primary); font-weight: 900; margin-bottom: 10px; letter-spacing: 1.5px; }
        .small-card h3 { font-size: 17px; margin: 0; font-weight: 800; letter-spacing: -0.5px; line-height: 1.3; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.04); }
        .price { font-weight: 950; font-size: 20px; color: white; }
        .add-btn { background: var(--primary); border: none; color: white; width: 40px; height: 40px; border-radius: 12px; font-weight: 900; cursor: pointer; transition: 0.3s; font-size: 20px; display: flex; align-items: center; justify-content: center; }
        .add-btn:hover { transform: scale(1.1) rotate(90deg); filter: brightness(1.1); }

        .shop-footer { margin-top: 120px; }
        .footer-line { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); margin-bottom: 40px; }
        .footer-content { display: flex; justify-content: space-between; align-items: center; }
        .footer-logo { font-size: 18px; font-weight: 950; letter-spacing: -1px; margin-bottom: 8px; }
        .footer-brand p { color: var(--text-muted); font-size: 12px; margin: 0; }
        .footer-links { display: flex; gap: 30px; }
        .footer-links a { color: var(--text-muted); text-decoration: none; font-size: 12px; font-weight: 700; transition: 0.3s; }
        .footer-links a:hover { color: var(--primary); }

        .loading { background: var(--bg); height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 950; color: var(--primary); letter-spacing: -1.5px; }
      `}</style>
    </div>
  );
};

export default ShopView;
