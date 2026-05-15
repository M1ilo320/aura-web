import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = "https://aura-api-5tbi.onrender.com";
    
    const fetchData = () => {
      fetch(`${BACKEND_URL}/api/shop/${slug}`)
        .then(res => res.json())
        .then(json => {
          if (json.shop) {
            setData(json);
            document.documentElement.style.setProperty('--primary', json.shop.accent_color || '#a855f7');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Odświeżaj co 30 sekund
    return () => clearInterval(interval);
  }, [slug]);

  const handleSteamLogin = () => {
    window.location.href = `https://aura-api-5tbi.onrender.com/api/auth/steam`;
  };

  if (loading) return <div className="loading">Wczytywanie...</div>;
  if (!data.shop) return <div className="error">Sklep nie istnieje.</div>;

  const { shop, products, recent, onlinePlayers } = data;

  return (
    <div className="site">
      <div className="bg-gradient"></div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span className="back-link">WRÓĆ NA {shop.name.split(' ')[0].toUpperCase()}</span>
            <div className="logo-text">{shop.name.toUpperCase()}</div>
          </div>
          <button className="steam-btn" onClick={handleSteamLogin}>
            <img src="https://cdn-icons-png.flaticon.com/512/1051/1051382.png" alt="" />
            ZALOGUJ PRZEZ STEAM
          </button>
        </div>
      </nav>

      {/* SUBNAV / TICKER */}
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
            )) : <span className="no-data">Czekamy na pierwszych kupujących...</span>}
          </div>
        </div>
      </div>

      <main className="content">
        <header className="hero">
          <h1>NAJSZYBSZA DOSTAWA</h1>
          <p>Wybierz pakiet i ciesz się grą w kilka minut. Najbezpieczniejszy sklep dla Twojego serwera.</p>
        </header>

        {/* PROMO CARD */}
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

        {/* PRODUCTS */}
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <div className="p-icon-box">📦</div>
              <div className="p-category">{p.category}</div>
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
        
        .bg-gradient { position: fixed; top: 0; width: 100%; height: 400px; background: radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.1) 0%, transparent 70%); z-index: -1; }
        
        .navbar { height: 80px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; }
        .nav-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; padding: 0 40px; }
        .back-link { font-size: 11px; color: #555; font-weight: 800; display: block; margin-bottom: 5px; }
        .logo-text { font-size: 22px; font-weight: 900; letter-spacing: -1px; }
        .steam-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px 24px; border-radius: 12px; font-size: 12px; font-weight: 800; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s; }
        .steam-btn:hover { background: rgba(255,255,255,0.08); }
        .steam-btn img { width: 18px; filter: invert(1); }

        .ticker { background: #0a0b11; border-bottom: 1px solid rgba(255,255,255,0.05); height: 55px; display: flex; align-items: center; }
        .ticker-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; align-items: center; padding: 0 40px; gap: 40px; }
        .online-status { font-size: 12px; display: flex; align-items: center; gap: 8px; color: #888; }
        .online-status .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
        .recent-list { display: flex; align-items: center; gap: 20px; font-size: 12px; }
        .ticker-label { color: #444; font-weight: 900; }
        .recent-item { background: rgba(255,255,255,0.02); padding: 5px 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .mini-avatar { width: 20px; height: 20px; background: #222; border-radius: 50%; }
        .highlight { color: var(--primary); font-weight: bold; }

        .content { max-width: 1100px; margin: 0 auto; padding: 60px 20px; }
        .hero { text-align: center; margin-bottom: 80px; }
        .hero h1 { font-size: 56px; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .hero p { color: #666; font-size: 18px; max-width: 600px; margin: 20px auto; line-height: 1.6; }

        .promo-card { background: #11131a; border-radius: 32px; border: 1px solid rgba(255,255,255,0.08); display: flex; overflow: hidden; height: 400px; margin-bottom: 60px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
        .promo-info { flex: 1.2; padding: 60px; display: flex; flex-direction: column; justify-content: center; }
        .promo-art { flex: 1; background: url('https://imgur.com/vHq7Fv8.png') no-repeat center; background-size: cover; background-blend-mode: overlay; background-color: #11131a; }
        .promo-badge { background: var(--primary); font-size: 10px; font-weight: 900; padding: 5px 12px; border-radius: 6px; width: fit-content; margin-bottom: 20px; }
        .promo-info h2 { font-size: 32px; margin: 0; font-weight: 900; }
        .promo-info p { color: #777; margin: 20px 0 40px; line-height: 1.6; }
        .promo-action { display: flex; align-items: center; gap: 30px; }
        .current-price { font-size: 36px; font-weight: 900; }
        .old-price { color: #444; text-decoration: line-through; font-size: 20px; font-weight: 700; }
        .buy-now-btn { background: var(--primary); color: white; border: none; padding: 18px 40px; border-radius: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .buy-now-btn:hover { transform: scale(1.05); filter: brightness(1.1); }

        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .product-card { background: #11131a; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 30px; transition: 0.3s; }
        .product-card:hover { transform: translateY(-10px); border-color: var(--primary); background: #14161f; }
        .p-icon-box { width: 60px; height: 60px; background: rgba(255,255,255,0.03); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
        .p-category { font-size: 10px; font-weight: 900; color: var(--primary); letter-spacing: 1px; margin-bottom: 10px; }
        .product-card h3 { font-size: 20px; margin: 0 0 10px 0; }
        .p-desc { color: #666; font-size: 14px; line-height: 1.6; height: 45px; overflow: hidden; }
        .p-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }
        .p-price { font-size: 24px; font-weight: 900; }
        .add-cart { background: transparent; border: 1px solid #333; color: white; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .add-cart:hover { border-color: var(--primary); color: var(--primary); }

        .loading { background: #07080c; height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; color: #a855f7; }
      `}</style>
    </div>
  );
};

export default ShopView;
对抗
