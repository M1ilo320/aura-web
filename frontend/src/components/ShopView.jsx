import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = "https://aura-api-5tbi.onrender.com";
    
    fetch(`${BACKEND_URL}/api/shop/${slug}`)
      .then(res => res.json())
      .then(data => {
        setShop(data.shop);
        setProducts(data.products);
        if (data.shop.accent_color) {
            document.documentElement.style.setProperty('--primary', data.shop.accent_color);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );

  if (!shop) return (
    <div className="error-screen">
      <h1>404</h1>
      <p>Sklep "{slug}" nie istnieje.</p>
    </div>
  );

  return (
    <div className="site-wrapper">
      <div className="glow-bg"></div>

      {/* TOP NAVBAR */}
      <nav className="top-nav">
        <div className="nav-left">Wróć na {shop.name.replace(' Store', '')}</div>
        <div className="nav-logo">
           <img src="https://imgur.com/vHq7Fv8.png" alt="Logo" />
        </div>
        <button className="steam-login">
          <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/steam-icon.png" width="20" style={{filter: 'invert(1)'}} />
          Zaloguj na Steam
        </button>
      </nav>

      {/* STATS & TICKER BAR */}
      <div className="stats-bar">
        <div className="online-players">
          <span className="online-count">21</span>
          <span className="online-label">Graczy Online</span>
        </div>
        <div className="recent-purchases">
          {[
            {u: 'WarszawskiGnuciak', i: 'UNBAN'},
            {u: 'DzikiWSH', i: 'GOLDEN COINS'},
            {u: 'Antolek', i: 'VIP GOLD'},
            {u: 'Smog', i: 'PRACA MECHANIKA'}
          ].map((p, idx) => (
            <div key={idx} className="purchase-item">
              <div className="avatar"></div>
              <span className="user">{p.u}</span>
              <span className="item">{p.i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>Szybko i bezpiecznie</h1>
        <p>Ekspresowa realizacja i wygodne zakupy. Nie zwlekaj!</p>
      </div>

      <div className="container">
        {/* MAIN PROMO CARD */}
        <div className="main-promo">
          <div className="promo-info">
            <h2 className="promo-title">ZESTAW POCZĄTKUJĄCEGO</h2>
            <p className="promo-desc">Zestaw zawiera: Rangę Trial Support i Golden Coins x1200</p>
            <div className="promo-footer">
              <div className="price-box">
                <span className="promo-price">49,99 zł</span>
                <span className="promo-old-price">90,00 zł</span>
              </div>
              <button className="btn-buy">KUP TERAZ</button>
            </div>
          </div>
          <div className="promo-image"></div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card">
              <div className="card-icon" style={{fontSize: '2rem'}}>📦</div>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <div className="price">{p.price} zł</div>
              <button className="p-buy">DO KOSZYKA</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopView;
对抗
