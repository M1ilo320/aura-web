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

  if (loading) return <div className="loading">WCZYTYWANIE SKLEPU...</div>;
  if (!data.shop) return <div className="loading">SKLEP NIE ISTNIEJE</div>;

  const categories = ['WSZYSTKO', ...new Set(data.products.map(p => p.category?.toUpperCase() || 'INNE'))];
  const filteredProducts = activeCategory === 'WSZYSTKO' 
    ? data.products 
    : data.products.filter(p => (p.category?.toUpperCase() || 'INNE') === activeCategory);

  const { shop, recent, onlinePlayers } = data;

  return (
    <div className="app-wrapper">
      <div className="mesh-gradient"></div>
      
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-left">
            <span>WRÓĆ NA <b>{shop.name.toUpperCase()}</b></span>
          </div>
          <div className="nav-center">
            <div className="logo-placeholder">AURA</div>
          </div>
          <div className="nav-right">
            {steamProfile ? (
              <div className="user-pill">
                <img src={steamProfile.avatar} alt="p" />
                <span>{steamProfile.nickname}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button className="steam-btn" onClick={handleSteamLogin}>
                 Zaloguj na Steam
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="activity-strip">
        <div className="strip-container">
          <div className="stats">
            <span className="dot"></span>
            <b>{onlinePlayers}</b> GRACZY ONLINE
          </div>
          <div className="divider"></div>
          <div className="ticker-wrapper">
            <div className="ticker-content">
              {recent && recent.length > 0 ? recent.map((r, i) => (
                <div key={i} className="t-item">
                  <img src={r.avatar} alt="" />
                  <span className="t-name">{r.nickname}</span>
                  <span className="t-prod">{r.item_name}</span>
                </div>
              )) : <div className="t-item">Oczekiwanie na pierwsze zamówienia...</div>}
            </div>
          </div>
        </div>
      </section>

      <div className="main-scroll">
        <header className="hero-header">
          <div className="badge-mini">WWW.{shop.name.toUpperCase()}.PL</div>
          <h1>Szybko i bezpiecznie</h1>
          <p>Ekspresowa realizacja i wygodne zakupy. Nie zwlekaj!</p>
        </header>

        <section className="hero-slider">
          <div className="hero-card">
            <div className="hero-info">
              <h2>ZESTAW GRACZA</h2>
              <p>Zestaw zawiera: Rangę Support / Miejsce z sezone / 10000 Monet</p>
              <div className="hero-price-row">
                <span className="price-pill">149,00 zł</span>
                <span className="old-price">200,00 zł</span>
              </div>
            </div>
            <div className="hero-visual">
              <img src="/premium_shop_hero_bundle_1778871007164.png" alt="Hero bundle" className="car-img" />
              <div className="hero-glow"></div>
            </div>
          </div>
        </section>

        <section className="products-section">
          <div className="section-head">
            <h3>Dostępne usługi</h3>
            <p>WSZYSTKIE PAKIETY SĄ DOSTARCZANE AUTOMATYCZNIE</p>
          </div>

          <div className="cat-tabs">
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

          <div className="grid">
            {filteredProducts.map(p => (
              <div key={p.id} className="item-card">
                <div className="card-top">
                  {p.price > 100 && <span className="p-badge">OKAZJA</span>}
                  <div className="item-icon">{p.category === 'WALUTA' ? '💰' : (p.category === 'RANGI' ? '👑' : '📦')}</div>
                </div>
                <div className="item-info">
                  <h4>{p.name}</h4>
                  <div className="price-row">
                    <span className="price">{p.price} zł</span>
                    <button className="buy-btn" onClick={() => handlePurchase(p)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>© 2024 {shop.name} Store. System by AuraStore.</p>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&display=swap');

        :root { --primary: #7e1b3d; --bg: #0b0a0b; --card: #151113; --text: #ffffff; }
        * { box-sizing: border-box; font-family: 'Montserrat', sans-serif; }
        body { background: var(--bg); color: var(--text); margin: 0; overflow-x: hidden; }

        .app-wrapper { min-height: 100vh; position: relative; }
        .mesh-gradient { 
          position: fixed; inset: 0; z-index: -1;
          background: radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 45%),
                      radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 45%),
                      radial-gradient(circle at 50% 50%, #000 0%, transparent 100%);
          opacity: 0.25;
        }

        /* NAVBAR */
        .top-nav { height: 70px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
        .nav-container { max-width: 1400px; margin: 0 auto; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
        .nav-left span { font-size: 11px; color: #777; letter-spacing: 1.5px; }
        .nav-left b { color: #fff; }
        .logo-placeholder { font-weight: 900; letter-spacing: 5px; font-size: 20px; color: var(--primary); }
        
        .steam-btn { background: var(--primary); border: none; color: #fff; padding: 10px 24px; border-radius: 12px; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .steam-btn:hover { filter: brightness(1.2); transform: translateY(-1px); }
        
        .user-pill { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); padding: 5px 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
        .user-pill img { width: 30px; height: 30px; border-radius: 8px; }
        .user-pill span { font-size: 13px; font-weight: 800; }
        .logout-btn { background: transparent; border: none; color: #ff4444; font-size: 10px; font-weight: 800; cursor: pointer; margin-left: 10px; padding: 0; }

        /* ACTIVITY STRIP */
        .activity-strip { height: 60px; background: rgba(0,0,0,0.4); border-bottom: 1px solid rgba(255,255,255,0.03); }
        .strip-container { max-width: 1400px; margin: 0 auto; height: 100%; display: flex; align-items: center; }
        .stats { padding: 0 40px; display: flex; align-items: center; gap: 10px; font-size: 11px; color: #888; white-space: nowrap; }
        .stats b { color: #fff; font-size: 14px; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
        .divider { width: 1px; height: 30px; background: rgba(255,255,255,0.08); }
        .ticker-wrapper { flex: 1; overflow: hidden; padding-left: 30px; }
        .ticker-content { display: flex; gap: 40px; }
        .t-item { display: flex; align-items: center; gap: 10px; min-width: max-content; }
        .t-item img { width: 26px; height: 26px; border-radius: 6px; }
        .t-name { font-size: 11px; font-weight: 800; color: var(--primary); }
        .t-prod { font-size: 11px; font-weight: 800; color: #fff; }

        /* HERO HEADER */
        .main-scroll { max-width: 1100px; margin: 0 auto; padding-top: 60px; }
        .hero-header { text-align: center; margin-bottom: 50px; }
        .badge-mini { background: var(--primary); display: inline-block; padding: 4px 12px; border-radius: 5px; font-size: 10px; font-weight: 900; margin-bottom: 15px; letter-spacing: 1px; }
        .hero-header h1 { font-size: 48px; font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1.1; }
        .hero-header p { color: #888; font-size: 15px; margin-top: 15px; }

        /* HERO CARD */
        .hero-slider { margin-bottom: 80px; }
        .hero-card { background: #151113; border: 1px solid rgba(255,255,255,0.05); border-radius: 35px; padding: 60px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
        .hero-info h2 { font-size: 42px; font-weight: 900; margin-bottom: 15px; letter-spacing: -2px; }
        .hero-info p { color: #888; font-size: 15px; margin-bottom: 40px; max-width: 350px; line-height: 1.6; }
        .hero-price-row { display: flex; align-items: center; gap: 20px; }
        .price-pill { background: var(--primary); padding: 14px 30px; border-radius: 50px; font-weight: 900; font-size: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .old-price { text-decoration: line-through; color: #444; font-size: 16px; font-weight: 800; }
        .hero-visual { position: relative; width: 400px; }
        .car-img { width: 100%; position: relative; z-index: 2; transform: scale(1.3) translateY(10px); filter: drop-shadow(0 20px 50px rgba(0,0,0,0.8)); }
        .hero-glow { position: absolute; inset: 0; background: radial-gradient(circle, var(--primary) 0%, transparent 70%); opacity: 0.3; filter: blur(50px); }

        /* PRODUCTS SECTION */
        .products-section { background: #120e10; border: 1px solid rgba(255,255,255,0.05); border-radius: 45px; padding: 70px; margin-bottom: 100px; box-shadow: 0 50px 100px rgba(0,0,0,0.3); }
        .section-head { text-align: center; margin-bottom: 60px; }
        .section-head h3 { font-size: 28px; font-weight: 900; margin-bottom: 10px; letter-spacing: -1px; }
        .section-head p { font-size: 11px; font-weight: 900; color: #22c55e; letter-spacing: 2px; }

        .cat-tabs { display: flex; gap: 15px; justify-content: center; margin-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 30px; }
        .cat-tabs button { background: transparent; border: none; color: #444; font-weight: 800; font-size: 13px; cursor: pointer; padding: 10px 25px; transition: 0.3s; position: relative; }
        .cat-tabs button.active { color: #fff; }
        .cat-tabs button.active::after { content: ''; position: absolute; bottom: -30px; left: 0; right: 0; height: 2px; background: var(--primary); box-shadow: 0 0 20px var(--primary); }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
        .item-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 30px; padding: 30px; transition: 0.4s; }
        .item-card:hover { border-color: var(--primary); transform: translateY(-10px); background: rgba(255,255,255,0.03); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .card-top { display: flex; justify-content: space-between; margin-bottom: 25px; min-height: 30px; }
        .p-badge { background: #22c55e; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 6px; color: #000; }
        .item-icon { font-size: 38px; width: 100%; text-align: center; margin: 15px 0; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3)); }
        .item-info h4 { font-size: 16px; font-weight: 800; text-align: center; margin: 0 0 25px; }
        .price-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 25px; }
        .price { font-size: 20px; font-weight: 900; color: #fff; }
        .buy-btn { background: var(--primary); border: none; color: #fff; width: 40px; height: 40px; border-radius: 12px; cursor: pointer; font-weight: 900; transition: 0.3s; font-size: 18px; }
        .buy-btn:hover { transform: scale(1.1) rotate(90deg); filter: brightness(1.2); }

        .footer { text-align: center; padding-bottom: 80px; color: #333; font-size: 12px; font-weight: 700; letter-spacing: 1px; }

        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: var(--primary); background: var(--bg); }
      `}</style>
    </div>
  );
};

export default ShopView;
