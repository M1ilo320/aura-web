import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug: urlSlug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('WSZYSTKO');
  const [userData, setUserData] = useState(null);
  const [steamProfile, setSteamProfile] = useState(null);

  const getSlug = () => {
    if (urlSlug) return urlSlug;
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return 'rainrp';
    return hostname.split('.')[0];
  };

  const currentSlug = getSlug();
  const BACKEND_URL = import.meta.env.VITE_API_URL || "https://aura-api-5tbi.onrender.com";

  useEffect(() => {
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

  // Pobieranie profilu Steam zalogowanego gracza
  useEffect(() => {
    if (userData?.steamid) {
      fetch(`${BACKEND_URL}/api/user/${userData.steamid}`)
        .then(res => res.json())
        .then(profile => setSteamProfile(profile))
        .catch(err => console.error("Steam Profile error:", err));
    }
  }, [userData]);

  useEffect(() => {
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
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [currentSlug]);

  const handleSteamLogin = () => {
    const origin = window.location.href;
    window.location.href = `${BACKEND_URL}/api/auth/steam?origin=${encodeURIComponent(origin)}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_steamid');
    setUserData(null);
    setSteamProfile(null);
  };

  const handlePurchase = (product) => {
    if (!userData) {
      handleSteamLogin();
      return;
    }
    
    fetch(`${BACKEND_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopId: data.shop.id,
        steamId: userData.steamid,
        productId: product.id,
        amount: 1
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        alert(`Sukces! Zakupiono ${product.name}. Odbierz nagrodę w grze.`);
      }
    });
  };

  if (loading) return <div className="loading">WCZYTYWANIE AURY...</div>;
  if (!data.shop) return <div className="loading">SKLEP NIE ISTNIEJE</div>;

  const categories = ['WSZYSTKO', ...new Set(data.products.map(p => p.category?.toUpperCase() || 'INNE'))];
  const filteredProducts = activeCategory === 'WSZYSTKO' 
    ? data.products 
    : data.products.filter(p => (p.category?.toUpperCase() || 'INNE') === activeCategory);

  const { shop, recent, onlinePlayers } = data;

  return (
    <div className="app-wrapper">
      <div className="main-container">
        <nav className="top-navbar">
          <div className="logo-section">
            <div className="shop-name">{shop.name.toUpperCase()}</div>
            <div className="online-tag"><span className="dot"></span> {onlinePlayers} GRACZY ONLINE</div>
          </div>
          
          <div className="nav-actions">
            {steamProfile ? (
              <div className="user-profile-card">
                <img src={steamProfile.avatar} alt="avatar" className="user-avatar" />
                <div className="user-details">
                  <span className="user-nick">{steamProfile.nickname}</span>
                  <button className="user-logout" onClick={handleLogout}>WYLOGUJ SIĘ</button>
                </div>
              </div>
            ) : (
              <button className="login-btn-steam" onClick={handleSteamLogin}>
                <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png" alt="Login with Steam" />
              </button>
            )}
          </div>
        </nav>

        <header className="shop-header">
          <span className="premium-badge">PROWADZISZ GRĘ NA NAJWYŻSZYM POZIOMIE</span>
          <h1>Twoja przewaga zaczyna się tutaj</h1>
          <p>Oficjalny sklep serwera RainRP. Każdy zakup wspiera nasz rozwój i pozwala nam tworzyć dla Was lepsze miejsce do gry.</p>
        </header>

        <section className="live-activity">
          <div className="activity-header">OSTATNIE TRANSAKCJE:</div>
          <div className="ticker-wrap">
            <div className="ticker-move">
              {recent && recent.length > 0 ? recent.map((r, i) => (
                <div key={i} className="activity-card">
                  <img src={r.avatar || "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} alt="p" />
                  <div className="act-details">
                    <span className="act-name">{r.nickname}</span>
                    <span className="act-item">kupił {r.item_name}</span>
                  </div>
                </div>
              )) : <div className="activity-card">Oczekiwanie na pierwsze zamówienia...</div>}
              {/* Duplikacja dla płynności pętli */}
              {recent && recent.length > 0 && recent.map((r, i) => (
                <div key={`dup-${i}`} className="activity-card">
                  <img src={r.avatar || "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} alt="p" />
                  <div className="act-details">
                    <span className="act-name">{r.nickname}</span>
                    <span className="act-item">kupił {r.item_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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
            <div key={p.id} className="modern-card">
              <div className="card-top">
                <div className="card-badge">{p.category || 'INNE'}</div>
                <div className="card-icon">{p.category === 'WALUTA' ? '💎' : (p.category === 'RANGI' ? '👑' : '📦')}</div>
              </div>
              <h3>{p.name}</h3>
              <div className="card-price-row">
                <div className="price-tag">{p.price} PLN</div>
                <button className="buy-trigger" onClick={() => handlePurchase(p)}>WYBIERZ</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="shop-footer">
          <div className="footer-grid">
            <div className="f-col">
              <h3>{shop.name} STORE</h3>
              <p>Najbezpieczniejszy system płatności i błyskawiczna dostawa produktów wprost na serwer.</p>
            </div>
            <div className="f-col">
              <h4>NAWIGACJA</h4>
              <a href="#">Strona Główna</a>
              <a href="#">Regulamin</a>
              <a href="#">Kontakt</a>
            </div>
          </div>
          <div className="footer-bottom">© 2024 AuraStore System. Wszystkie prawa zastrzeżone.</div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        :root { --primary: #a855f7; --bg: #0b0d12; --card: #151921; --card-hover: #1c222d; --text: #ffffff; --text-muted: #808491; }
        * { box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { background: var(--bg); color: var(--text); margin: 0; overflow-x: hidden; }

        .app-wrapper { min-height: 100vh; background: radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.05) 0%, transparent 30%); }
        .main-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        .top-navbar { height: 100px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
        .shop-name { font-size: 28px; font-weight: 800; letter-spacing: -1.5px; background: linear-gradient(to bottom, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .online-tag { font-size: 11px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }

        .user-profile-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 8px 16px 8px 8px; border-radius: 18px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
        .user-nick { font-size: 14px; font-weight: 700; display: block; }
        .user-logout { background: transparent; border: none; color: #f43f5e; font-size: 11px; font-weight: 800; cursor: pointer; padding: 0; }
        .login-btn-steam { background: transparent; border: none; cursor: pointer; transition: 0.3s; padding: 0; }
        .login-btn-steam:hover { transform: translateY(-2px); filter: brightness(1.1); }

        .shop-header { text-align: center; padding: 60px 0; }
        .premium-badge { color: var(--primary); font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: block; }
        .shop-header h1 { font-size: 56px; font-weight: 800; margin: 0; letter-spacing: -3px; line-height: 1.1; }
        .shop-header p { color: var(--text-muted); font-size: 17px; max-width: 600px; margin: 25px auto 0; line-height: 1.6; }

        .live-activity { background: var(--card); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 20px; margin-bottom: 60px; overflow: hidden; position: relative; }
        .activity-header { font-size: 11px; font-weight: 800; color: var(--primary); margin-bottom: 15px; letter-spacing: 1px; }
        .ticker-wrap { width: 100%; overflow: hidden; }
        .ticker-move { display: flex; gap: 20px; width: max-content; animation: tickerScroll 30s linear infinite; }
        .activity-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.03); padding: 12px 20px; border-radius: 16px; display: flex; align-items: center; gap: 15px; min-width: 240px; }
        .activity-card img { width: 32px; height: 32px; border-radius: 10px; }
        .act-name { font-size: 13px; font-weight: 700; display: block; }
        .act-item { font-size: 11px; color: var(--text-muted); }
        @keyframes tickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .category-tabs { display: flex; gap: 10px; margin-bottom: 40px; justify-content: center; }
        .category-tabs button { background: var(--card); border: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); padding: 14px 28px; border-radius: 16px; font-weight: 700; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .category-tabs button.active { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
        .modern-card { background: var(--card); border: 1px solid rgba(255,255,255,0.05); padding: 35px; border-radius: 32px; transition: 0.4s; position: relative; }
        .modern-card:hover { transform: translateY(-10px); border-color: var(--primary); background: var(--card-hover); box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .card-badge { background: rgba(255,255,255,0.03); font-size: 10px; font-weight: 800; padding: 6px 12px; border-radius: 8px; color: var(--text-muted); text-transform: uppercase; }
        .card-icon { font-size: 32px; }
        .modern-card h3 { font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -1px; }
        .card-price-row { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }
        .price-tag { font-size: 24px; font-weight: 800; color: #fff; }
        .buy-trigger { background: var(--primary); border: none; color: #fff; font-weight: 800; padding: 12px 24px; border-radius: 14px; cursor: pointer; transition: 0.3s; font-size: 12px; }
        .buy-trigger:hover { filter: brightness(1.2); transform: scale(1.05); }

        .shop-footer { margin-top: 120px; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 100px; margin-bottom: 60px; }
        .f-col h3 { font-size: 20px; margin-bottom: 20px; }
        .f-col h4 { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
        .f-col p { color: var(--text-muted); line-height: 1.6; }
        .f-col a { display: block; color: var(--text-muted); text-decoration: none; margin-bottom: 12px; font-size: 14px; font-weight: 600; }
        .f-col a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; color: #444; font-size: 12px; text-align: center; }

        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: var(--primary); background: var(--bg); }

        @media (max-width: 768px) {
          .shop-header h1 { font-size: 36px; }
          .footer-grid { grid-template-columns: 1fr; gap: 50px; }
        }
      `}</style>
    </div>
  );
};

export default ShopView;
