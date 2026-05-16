import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ShopView.css';

const ShopView = () => {
  const { slug: urlSlug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('WSZYSTKO');
  const [userData, setUserData] = useState(null);
  const [steamProfile, setSteamProfile] = useState(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

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
            const accent = json.shop.accent_color || '#C9CED6';
            document.documentElement.style.setProperty('--primary', accent);

            // Konwersja HEX na RGB dla rgba() w CSS
            const r = parseInt(accent.slice(1, 3), 16);
            const g = parseInt(accent.slice(3, 5), 16);
            const b = parseInt(accent.slice(5, 7), 16);
            document.documentElement.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
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

  useEffect(() => {
    if (data.shop) {
      document.title = `${data.shop.name} - Sklep AuraStore`;
    }
  }, [data.shop]);

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
            <a href="/" className="back-home-link">
              <span>WRÓĆ NA <b>AURA</b></span>
            </a>
          </div>
          <div className="nav-center">
            <div className="logo-img-wrap">
              <img src="/aura_logo.png" alt="AURA" className="nav-logo-img" />
            </div>
          </div>
          <div className="nav-right">
            {steamProfile ? (
              <div className="user-pill">
                <img src={steamProfile.avatar} alt="p" />
                <div className="user-details-mini">
                  <span className="unick">{steamProfile.nickname}</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
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
            <div className="stats-main">
              <div className="stats-dot-wrap">
                <span className="dot"></span>
                <b>{onlinePlayers}</b>
              </div>
              <span className="stats-label">GRACZY ONLINE</span>
            </div>
          </div>
          <div className="divider"></div>
          <div className="ticker-wrapper">
            <div className={`ticker-content ${recent && recent.length > 0 ? 'scrolling' : 'static'}`}>
              {recent && recent.length > 0 ? recent.map((r, i) => (
                <div key={i} className="t-item">
                  <img src={r.avatar} alt="" />
                  <span className="t-name">{r.nickname}</span>
                  <span className="t-prod">{r.item_name}</span>
                </div>
              )) : <div className="t-item-placeholder">Oczekiwanie na pierwsze zamówienia...</div>}
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

        {data.products.some(p => p.category?.toUpperCase() === 'PAKIETY' || p.name.toUpperCase().includes('ZESTAW')) && (
          <section className="hero-slider">
            {(() => {
              const heroProducts = data.products.filter(p =>
                p.category?.toUpperCase() === 'PAKIETY' ||
                p.name.toUpperCase().includes('ZESTAW')
              );
              const currentHero = heroProducts[currentHeroIndex];

              const nextHero = () => setCurrentHeroIndex((prev) => (prev + 1) % heroProducts.length);
              const prevHero = () => setCurrentHeroIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);

              // Normalize title for display (e.g. ZESTAW GRACZ -> ZESTAW GRACZA)
              const displayTitle = currentHero.name.toUpperCase() === 'ZESTAW GRACZ' ? 'ZESTAW GRACZA' : currentHero.name.toUpperCase();

              return (
                <div className="hero-container">
                  {heroProducts.length > 1 && (
                    <>
                      <button className="slider-arrow prev" onClick={prevHero}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <button className="slider-arrow next" onClick={nextHero}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </>
                  )}

                  <div className="hero-card">
                    <div className="hero-info">
                      <div className="hero-tag">POLECANY PAKIET</div>
                      <h2>{displayTitle}</h2>
                      <p className="hero-desc">{currentHero.description || "Zestaw zawiera unikalne przedmioty i rangi dostępne tylko w tym pakiecie."}</p>

                      <div className="hero-price-row">
                        <button className="hero-buy-btn-premium" onClick={() => handlePurchase(currentHero)}>
                          {currentHero.price} zł
                        </button>
                        {currentHero.price > 10 && (
                          <span className="old-price">{(currentHero.price * 1.35).toFixed(2)} zł</span>
                        )}
                      </div>
                    </div>

                    <div className="hero-visual">
                      <img src={currentHero.image_url || "/hero_bundle.png"} alt="Hero bundle" className="hero-img-main" />
                      <div className="hero-glow-premium"></div>
                    </div>

                    {heroProducts.length > 1 && (
                      <div className="hero-dots">
                        {heroProducts.map((_, idx) => (
                          <div
                            key={idx}
                            className={`dot ${idx === currentHeroIndex ? 'active' : ''}`}
                            onClick={() => setCurrentHeroIndex(idx)}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </section>
        )}

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
              <div
                key={p.id}
                className="item-card"
                onClick={() => handlePurchase(p)}
              >
                <div className="card-top">
                  <div className="item-icon">
                    {p.category === 'WALUTA' ? '💰' : (p.category === 'RANGI' ? '👑' : '📦')}
                  </div>
                  {p.price > 100 && (
                    <div className="p-badge-wrap">
                      <span className="p-badge">OKAZJA</span>
                    </div>
                  )}
                </div>
                <div className="item-info">
                  <h4>{p.name}</h4>
                  <div className="price-row">
                    <span className="price">{p.price} zł</span>
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

    </div>
  );
};

export default ShopView;
