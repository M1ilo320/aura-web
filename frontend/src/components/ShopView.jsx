import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug: urlSlug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);

  const getSlug = () => {
    if (urlSlug) return urlSlug;
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (hostname === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) return 'plugrp';
    if (parts.length >= 3) return parts[0];
    return parts[0];
  };

  const currentSlug = getSlug();

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
    window.location.href = `${BACKEND_URL}/api/auth/steam`;
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

  const { shop, products, recent, onlinePlayers } = data;

  return (
    <div className="site">
      <div className="bg-gradient"></div>

      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span className="back-link">WRÓĆ DO SERWERA</span>
            <div className="logo-text">{shop.name.toUpperCase()}</div>
          </div>
          <button className="steam-btn" onClick={handleSteamLogin}>
            <img src="https://cdn-icons-png.flaticon.com/512/1051/1051382.png" alt="" />
            ZALOGUJ PRZEZ STEAM
          </button>
        </div>
      </nav>

      <div className="ticker">
        <div className="ticker-container">
          <div className="online-status">
            <span className="dot"></span>
            <b>{onlinePlayers}</b> GRACZY ONLINE
          </div>
          <div className="recent-list">
            <span className="ticker-label">OSTATNIE ZAKUPY:</span>
            {recent.length > 0 ? recent.map((r, i) => (
              <div key={i} className="recent-item">
                <div className="mini-avatar"></div>
                <b>{r.steam_id.substring(0, 10)}...</b> kupił <span className="highlight">{r.item_name}</span>
              </div>
            )) : <span className="no-data">Czekamy na pierwsze zakupy...</span>}
          </div>
        </div>
      </div>

      <main className="content">
        <header className="hero">
          <h1>NAJSZYBSZA DOSTAWA</h1>
          <p>Wybierz pakiet i ciesz się grą w kilka minut. Najbezpieczniejszy sklep dla Twojego serwera.</p>
        </header>

        <div className="promo-card">
          <div className="promo-info">
            <div className="promo-badge">POLECANE</div>
            <h2>PAKIET STARTOWY PRO</h2>
            <p>Zestaw zawiera unikalny pojazd, rangę VIP na 30 dni oraz 2500 monet na start.</p>
            <div className="promo-action">
              <div className="prices">
                <span className="current-price">59.99 PLN</span>
                <span className="old-price">120.00 PLN</span>
              </div>
              <button className="buy-now-btn">KUPUJĘ TERAZ</button>
            </div>
          </div>
          <div className="promo-art"></div>
        </div>

        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="p-icon-box">📦</div>
              <div className="p-category">{p.category || 'INNE'}</div>
              <h3>{p.name}</h3>
              <p className="p-desc">{p.description}</p>
              <div className="p-footer">
                <div className="p-price">{p.price} PLN</div>
                <button className="add-cart">DODAJ</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        :root { --primary: #a855f7; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #07080c; color: white; font-family: 'Inter', sans-serif; }
        
        .bg-gradient { position: fixed; top: 0; width: 100%; height: 500px; background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, transparent 70%); z-index: -1; }
        
        .navbar { height: 90px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; background: rgba(7, 8, 12, 0.8); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100; }
        .nav-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; padding: 0 40px; }
        .back-link { font-size: 10px; color: #555; font-weight: 900; display: block; margin-bottom: 4px; letter-spacing: 1px; }
        .logo-text { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
        .steam-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: white; padding: 12px 24px; border-radius: 14px; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; }
        .steam-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); border-color: rgba(255,255,255,0.2); }
        .steam-btn img { width: 18px; filter: invert(1); }

        .ticker { background: #0a0b11; border-bottom: 1px solid rgba(255,255,255,0.05); height: 60px; display: flex; align-items: center; }
        .ticker-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; align-items: center; padding: 0 40px; gap: 40px; }
        .online-status { font-size: 13px; display: flex; align-items: center; gap: 10px; color: #888; font-weight: 600; }
        .online-status .dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 15px rgba(34, 197, 94, 0.5); }
        .recent-list { display: flex; align-items: center; gap: 20px; font-size: 12px; }
        .ticker-label { color: #444; font-weight: 900; }
        .recent-item { background: rgba(255,255,255,0.02); padding: 6px 15px; border-radius: 10px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
        .recent-item:hover { background: rgba(255,255,255,0.05); }
        .mini-avatar { width: 22px; height: 22px; background: #222; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); }
        .highlight { color: var(--primary); font-weight: 800; }

        .content { max-width: 1200px; margin: 0 auto; padding: 80px 20px; }
        .hero { text-align: center; margin-bottom: 100px; }
        .hero h1 { font-size: 72px; font-weight: 950; margin: 0; letter-spacing: -4px; line-height: 1; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { color: #888; font-size: 20px; max-width: 600px; margin: 25px auto; line-height: 1.6; font-weight: 500; }

        .promo-card { background: #0e1017; border-radius: 40px; border: 1px solid rgba(255,255,255,0.08); display: flex; overflow: hidden; height: 450px; margin-bottom: 80px; box-shadow: 0 40px 100px rgba(0,0,0,0.6); position: relative; }
        .promo-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
        .promo-info { flex: 1.2; padding: 80px; display: flex; flex-direction: column; justify-content: center; }
        .promo-art { flex: 1; background: url('https://imgur.com/vHq7Fv8.png') no-repeat center; background-size: cover; position: relative; }
        .promo-art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #0e1017 0%, transparent 100%); }
        .promo-badge { background: var(--primary); font-size: 11px; font-weight: 900; padding: 6px 16px; border-radius: 8px; width: fit-content; margin-bottom: 25px; box-shadow: 0 10px 20px rgba(168, 85, 247, 0.4); }
        .promo-info h2 { font-size: 42px; margin: 0; font-weight: 900; letter-spacing: -1px; }
        .promo-info p { color: #888; margin: 25px 0 45px; line-height: 1.6; font-size: 16px; }
        .promo-action { display: flex; align-items: center; gap: 40px; }
        .current-price { font-size: 44px; font-weight: 900; }
        .old-price { color: #444; text-decoration: line-through; font-size: 24px; font-weight: 700; }
        .buy-now-btn { background: var(--primary); color: white; border: none; padding: 20px 50px; border-radius: 20px; font-weight: 900; cursor: pointer; transition: 0.4s; font-size: 16px; box-shadow: 0 20px 40px rgba(168, 85, 247, 0.3); }
        .buy-now-btn:hover { transform: scale(1.05) translateY(-5px); filter: brightness(1.1); box-shadow: 0 30px 60px rgba(168, 85, 247, 0.5); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
        .product-card { background: #0e1017; border: 1px solid rgba(255,255,255,0.06); border-radius: 32px; padding: 40px; transition: 0.4s; position: relative; }
        .product-card:hover { transform: translateY(-15px); border-color: var(--primary); background: #12151d; box-shadow: 0 30px 60px rgba(0,0,0,0.4); }
        .p-icon-box { width: 70px; height: 70px; background: rgba(255,255,255,0.03); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.05); }
        .p-category { font-size: 11px; font-weight: 900; color: var(--primary); letter-spacing: 1.5px; margin-bottom: 12px; }
        .product-card h3 { font-size: 24px; margin: 0 0 12px 0; font-weight: 800; }
        .p-desc { color: #777; font-size: 15px; line-height: 1.6; height: 50px; overflow: hidden; margin-bottom: 0; }
        .p-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
        .p-price { font-size: 28px; font-weight: 900; }
        .add-cart { background: transparent; border: 1px solid #333; color: white; padding: 12px 28px; border-radius: 14px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .add-cart:hover { border-color: var(--primary); color: var(--primary); background: rgba(168, 85, 247, 0.05); }

        .loading { background: #07080c; height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: var(--primary); }
      `}</style>
    </div>
  );
};

export default ShopView;
