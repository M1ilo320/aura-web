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
      {/* GÓRNY PASEK NAWIGACJI (HEADER) */}
      <nav className="header-bar">
        <div className="header-left">
          <span className="back-link">WRÓĆ NA <b>AuraStore</b></span>
        </div>
        
        <div className="header-center">
          <img src="https://i.imgur.com/8YvLh8f.png" alt="logo" className="center-skull" />
        </div>

        <div className="header-right">
          {steamProfile ? (
            <div className="user-profile-mini">
              <img src={steamProfile.avatar} alt="p" />
              <div className="user-info-mini">
                <span>{steamProfile.nickname}</span>
                <button onClick={handleLogout}>WYLOGUJ</button>
              </div>
            </div>
          ) : (
            <button className="steam-login-button" onClick={handleSteamLogin}>
              <i className="key-icon">🔑</i> Zaloguj na Steam
            </button>
          )}
        </div>
      </nav>

      {/* PASEK LICZNIKA I OSTATNICH ZAKUPÓW (SUBHEADER) */}
      <section className="activity-bar">
        <div className="activity-container">
          <div className="players-counter">
            <span className="online-dot"></span>
            <div className="count-info">
              <span className="number">{onlinePlayers}</span>
              <span className="label">GRACZY ONLINE</span>
            </div>
          </div>
          
          <div className="vertical-divider"></div>

          <div className="ticker-section">
            <div className="ticker-track">
              {recent && recent.length > 0 ? [...recent, ...recent].map((r, i) => (
                <div key={i} className="purchase-item">
                  <img src={r.avatar || "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg"} alt="p" />
                  <div className="p-details">
                    <span className="p-name">{r.nickname.toUpperCase()}</span>
                    <span className="p-product">{r.item_name.toUpperCase()}</span>
                  </div>
                </div>
              )) : (
                <div className="purchase-item">
                  <span className="p-product">OCZEKIWANIE NA PIERWSZE ZAKUPY...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="main-content">
        <header className="hero-section">
          <h1>{shop.name.toUpperCase()} - OFICJALNY SKLEP</h1>
          <p>Witaj w oficjalnym sklepie serwera {shop.name}. Wszystkie środki przeznaczane są na rozwój projektu.</p>
        </header>

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
            <div key={p.id} className="premium-card">
              <div className="card-header">
                <span className="card-cat">{p.category || 'INNE'}</span>
                <div className="card-icon">📦</div>
              </div>
              <h3>{p.name}</h3>
              <div className="card-bottom">
                <span className="card-price">{p.price} PLN</span>
                <button className="buy-trigger" onClick={() => handlePurchase(p)}>KUP TERAZ</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        :root { --primary: #a855f7; --bg: #0d0f17; --bar: #12141f; --card: #161925; --text: #ffffff; --text-muted: #6b7280; }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background: var(--bg); color: var(--text); margin: 0; overflow-x: hidden; }

        /* HEADER BAR (TOP) */
        .header-bar { height: 70px; background: var(--bar); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .back-link { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: 0.3s; }
        .back-link b { color: #888; }
        .back-link:hover { color: #fff; }
        .center-skull { height: 35px; opacity: 0.8; }
        .steam-login-button { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 20px; border-radius: 50px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .steam-login-button:hover { background: rgba(255,255,255,0.07); transform: translateY(-1px); border-color: var(--primary); }
        .user-profile-mini { display: flex; align-items: center; gap: 10px; }
        .user-profile-mini img { width: 32px; height: 32px; border-radius: 8px; }
        .user-info-mini span { font-size: 11px; font-weight: 800; display: block; }
        .user-info-mini button { background: transparent; border: none; color: #f43f5e; font-size: 9px; font-weight: 800; cursor: pointer; padding: 0; }

        /* ACTIVITY BAR (SUBHEADER) */
        .activity-bar { height: 80px; background: rgba(0,0,0,0.15); border-bottom: 1px solid rgba(255,255,255,0.03); }
        .activity-container { max-width: 1400px; margin: 0 auto; height: 100%; display: flex; align-items: center; }
        
        .players-counter { display: flex; align-items: center; gap: 15px; padding: 0 40px; min-width: 200px; }
        .online-dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px rgba(34,197,94,0.5); }
        .count-info .number { font-size: 18px; font-weight: 900; display: block; line-height: 1; }
        .count-info .label { font-size: 10px; color: var(--text-muted); font-weight: 800; letter-spacing: 0.5px; }

        .vertical-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.05); }

        .ticker-section { flex: 1; overflow: hidden; padding-left: 20px; }
        .ticker-track { display: flex; gap: 25px; overflow-x: auto; }
        .ticker-track::-webkit-scrollbar { display: none; }
        .purchase-item { display: flex; align-items: center; gap: 12px; }
        .purchase-item img { width: 34px; height: 34px; border-radius: 6px; }
        .p-details .p-name { font-size: 11px; font-weight: 800; color: #44aaff; display: block; }
        .p-details .p-product { font-size: 11px; font-weight: 800; color: #fff; }

        @keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* CONTENT */
        .main-content { max-width: 1200px; margin: 0 auto; padding: 80px 20px; }
        .hero-section { text-align: center; margin-bottom: 80px; }
        .hero-section h1 { font-size: 48px; font-weight: 900; letter-spacing: -2px; margin-bottom: 20px; }
        .hero-section p { color: var(--text-muted); max-width: 600px; margin: 0 auto; line-height: 1.6; }

        .category-tabs { display: flex; gap: 10px; margin-bottom: 60px; justify-content: center; }
        .category-tabs button { background: var(--card); border: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); padding: 14px 28px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; transition: 0.3s; }
        .category-tabs button.active { background: var(--primary); color: #fff; border-color: var(--primary); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .premium-card { background: var(--card); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 24px; transition: 0.3s; }
        .premium-card:hover { transform: translateY(-10px); border-color: var(--primary); background: #1a1e2b; }
        .card-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .card-cat { font-size: 10px; font-weight: 900; color: var(--primary); letter-spacing: 1.5px; text-transform: uppercase; }
        .premium-card h3 { font-size: 22px; font-weight: 800; margin: 0 0 40px; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; }
        .card-price { font-size: 24px; font-weight: 900; }
        .buy-trigger { background: var(--primary); border: none; color: #fff; font-weight: 900; padding: 12px 24px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-size: 12px; }
        .buy-trigger:hover { filter: brightness(1.2); transform: scale(1.05); }

        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: var(--primary); background: var(--bg); }
      `}</style>
    </div>
  );
};

export default ShopView;
