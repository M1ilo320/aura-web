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

  // Pobieranie profilu Steam
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
    const interval = setInterval(fetchData, 30000);
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
                  <button className="user-logout" onClick={handleLogout}>WYLOGUJ</button>
                </div>
              </div>
            ) : (
              <button className="login-btn" onClick={handleSteamLogin}>
                <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png" alt="steam" />
              </button>
            )}
          </div>
        </nav>

        <header className="shop-header">
          <span className="badge">OFFICIAL STORE</span>
          <h1>Najlepsze pakiety na serwerze</h1>
          <p>Automatyczna dostawa, bezpieczne płatności i wsparcie dla Twojego ulubionego serwera.</p>
        </header>

        <section className="recent-ticker">
          <div className="ticker-label">OSTATNIE ZAKUPY:</div>
          <div className="ticker-content">
            {recent && recent.length > 0 ? recent.map((r, i) => (
              <div key={i} className="ticker-item">
                <span className="t-id">{r.steam_id.substring(0, 6)}..</span> 
                kupił <span className="t-item">{r.item_name}</span>
              </div>
            )) : <div className="ticker-item">Oczekiwanie na pierwsze zakupy...</div>}
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
            <div key={p.id} className="product-card">
              <div className="p-icon">{p.category === 'WALUTA' ? '💰' : (p.category === 'RANGI' ? '👑' : '📦')}</div>
              <div className="p-category">{p.category || 'INNE'}</div>
              <h3>{p.name}</h3>
              <div className="p-footer">
                <span className="p-price">{p.price} PLN</span>
                <button className="p-buy" onClick={() => handlePurchase(p)}>KUP</button>
              </div>
            </div>
          ))}
        </div>

        <footer className="main-footer">
          <div className="f-logo">{shop.name} STORE</div>
          <div className="f-links">
            <a href="#">REGULAMIN</a>
            <a href="#">KONTAKT</a>
            <a href="#">POLITYKA</a>
          </div>
        </footer>
      </div>

      <style>{`
        :root { --primary: #a855f7; --bg: #090b10; --card: #11141d; --card-light: #1a1e2b; --text: #ffffff; --text-dim: #717684; }
        * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background: var(--bg); color: var(--text); margin: 0; }
        
        .main-container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        
        .top-navbar { height: 100px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .shop-name { font-size: 26px; font-weight: 950; letter-spacing: -1px; }
        .online-tag { font-size: 11px; font-weight: 800; color: var(--text-dim); display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }

        .user-profile-card { display: flex; align-items: center; gap: 12px; background: var(--card-light); padding: 6px 16px 6px 6px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); }
        .user-avatar { width: 38px; height: 38px; border-radius: 12px; }
        .user-nick { font-size: 13px; font-weight: 800; display: block; }
        .user-logout { background: transparent; border: none; color: #ff4444; font-size: 10px; font-weight: 900; cursor: pointer; padding: 0; margin-top: 2px; }
        .login-btn { background: transparent; border: none; cursor: pointer; opacity: 0.8; transition: 0.3s; }
        .login-btn:hover { opacity: 1; transform: translateY(-2px); }

        .shop-header { text-align: center; padding: 80px 0 60px; }
        .badge { background: rgba(168, 85, 247, 0.15); color: var(--primary); font-size: 11px; font-weight: 900; padding: 6px 14px; border-radius: 8px; letter-spacing: 1px; }
        .shop-header h1 { font-size: 48px; font-weight: 950; margin: 20px 0 15px; letter-spacing: -2px; }
        .shop-header p { color: var(--text-dim); max-width: 550px; margin: 0 auto; line-height: 1.6; }

        .recent-ticker { background: var(--card); border: 1px solid rgba(255,255,255,0.05); padding: 15px 25px; border-radius: 20px; display: flex; align-items: center; gap: 20px; margin-bottom: 50px; overflow: hidden; }
        .ticker-label { font-size: 11px; font-weight: 900; color: var(--primary); white-space: nowrap; }
        .ticker-content { display: flex; gap: 30px; animation: ticker 40s linear infinite; }
        .ticker-item { font-size: 12px; font-weight: 600; color: var(--text-dim); white-space: nowrap; }
        .t-id { color: #fff; }
        .t-item { color: var(--primary); font-weight: 800; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .category-tabs { display: flex; gap: 10px; margin-bottom: 40px; justify-content: center; }
        .category-tabs button { background: var(--card); border: 1px solid rgba(255,255,255,0.05); color: var(--text-dim); padding: 12px 24px; border-radius: 14px; font-weight: 800; font-size: 12px; cursor: pointer; transition: 0.3s; }
        .category-tabs button.active { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 10px 20px rgba(168, 85, 247, 0.2); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .product-card { background: var(--card); border: 1px solid rgba(255,255,255,0.05); padding: 35px; border-radius: 28px; transition: 0.3s; position: relative; overflow: hidden; }
        .product-card:hover { transform: translateY(-8px); border-color: var(--primary); background: var(--card-light); }
        .p-icon { font-size: 32px; margin-bottom: 25px; }
        .p-category { font-size: 10px; font-weight: 900; color: var(--primary); letter-spacing: 1px; margin-bottom: 8px; }
        .product-card h3 { font-size: 20px; margin: 0; font-weight: 900; letter-spacing: -0.5px; }
        .p-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }
        .p-price { font-size: 22px; font-weight: 950; }
        .p-buy { background: var(--primary); border: none; color: #fff; font-weight: 950; padding: 10px 22px; border-radius: 12px; cursor: pointer; transition: 0.3s; font-size: 12px; }
        .p-buy:hover { filter: brightness(1.1); transform: scale(1.05); }

        .main-footer { margin-top: 100px; padding: 60px 0; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .f-logo { font-size: 14px; font-weight: 900; color: var(--text-dim); }
        .f-links { display: flex; gap: 25px; }
        .f-links a { font-size: 11px; font-weight: 900; color: var(--text-dim); text-decoration: none; }
        .f-links a:hover { color: #fff; }

        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; letter-spacing: 2px; color: var(--primary); }

        @media (max-width: 768px) {
          .main-footer { flex-direction: column; gap: 30px; text-align: center; }
          .shop-header h1 { font-size: 32px; }
        }
      `}</style>
    </div>
  );
};

export default ShopView;
