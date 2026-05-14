import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, User, Users, ChevronLeft, ChevronRight, Zap, Shield, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopView = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([
    { user: 'WarszawskiGnuciak', item: 'UNBAN', time: '2m' },
    { user: 'DzikiWSH', item: 'GOLDEN COINS', time: '5m' },
    { user: 'Antolek', item: 'VIP GOLD', time: '12m' },
    { user: 'Smog', item: 'PRACA MECHANIKA', time: '15m' },
  ]);

  useEffect(() => {
    // Tutaj wpisz swój URL z Rendera
    const BACKEND_URL = "https://aura-sklep.onrender.com";
    
    fetch(`${BACKEND_URL}/api/shop/${slug}`)
      .then(res => res.json())
      .then(data => {
        setShop(data.shop);
        setProducts(data.products);
        document.documentElement.style.setProperty('--primary', data.shop.accent_color || '#3b82f6');
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (loading) return <div className="full-loader">Wczytywanie Twojego Sklepu...</div>;
  if (!shop) return <div className="error-screen">Sklep nie istnieje.</div>;

  return (
    <div className="aura-wrapper">
      {/* 1. TOP TICKER (Ostatnie zakupy) */}
      <div className="purchase-ticker glass">
        <div className="ticker-content">
          <div className="online-count">
            <div className="pulse-dot"></div>
            <span><b>47</b> GRACZY ONLINE</span>
          </div>
          <div className="ticker-items">
            {purchases.concat(purchases).map((p, i) => (
              <div key={i} className="ticker-card">
                <span className="user">{p.user}</span>
                <span className="item">{p.item}</span>
              </div>
            ))}
          </div>
          <button className="steam-btn">Zaloguj na Steam</button>
        </div>
      </div>

      {/* 2. LOGO BAR */}
      <div className="logo-bar">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="main-logo">
           {shop.logo_url ? <img src={shop.logo_url} alt="logo" /> : <div className="placeholder-logo">A</div>}
           <h1>{shop.name}</h1>
        </motion.div>
      </div>

      {/* 3. HERO CAROUSEL */}
      <section className="hero-carousel">
        <div className="carousel-card glass">
           <div className="hero-info">
             <span className="badge">POLECANE</span>
             <h2>ZESTAW POCZĄTKUJĄCEGO</h2>
             <p>Zestaw zawiera: Rangę Support, 1200 monet oraz unikalny pojazd.</p>
             <div className="hero-price">
               <span className="current">49,99 zł</span>
               <span className="old">90,00 zł</span>
               <button className="buy-hero-btn">KUP TERAZ</button>
             </div>
           </div>
           <div className="hero-image">
             <img src="https://i.ibb.co/hR4f7pB/t-support.png" alt="Featured" />
             <div className="glow-effect"></div>
           </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID */}
      <main className="shop-grid-container">
        <div className="grid-header">
           <div className="categories">
             <button className="cat-btn active">WSZYSTKIE</button>
             <button className="cat-btn">RANGI</button>
             <button className="cat-btn">POJAZDY</button>
             <button className="cat-btn">UNBANY</button>
           </div>
        </div>

        <div className="product-grid">
          {products.map((p, i) => (
            <motion.div 
              key={p.id} 
              className="p-card glass"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-img">
                {p.popular && <div className="p-badge">OKAZJA</div>}
              </div>
              <div className="p-details">
                <span className="p-cat">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="p-footer">
                   <span className="p-price">{p.price} zł</span>
                   <button className="p-buy"><ShoppingCart size={18}/> KUP</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .aura-wrapper { background: #0b0d14; color: white; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        
        /* TICKER */
        .purchase-ticker { height: 60px; position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; padding: 0 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ticker-content { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
        .online-count { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #94a3b8; min-width: 150px; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
        
        .ticker-items { flex: 1; overflow: hidden; display: flex; gap: 2rem; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
        .ticker-card { display: flex; gap: 8px; font-size: 0.8rem; white-space: nowrap; background: rgba(255,255,255,0.02); padding: 5px 15px; border-radius: 5px; }
        .ticker-card .user { font-weight: 800; }
        .ticker-card .item { color: var(--primary); font-weight: 700; text-transform: uppercase; }

        .steam-btn { background: white; color: black; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; }

        /* LOGO BAR */
        .logo-bar { height: 120px; display: flex; align-items: center; justify-content: center; }
        .main-logo { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .main-logo h1 { font-size: 1.5rem; letter-spacing: 5px; font-weight: 900; background: linear-gradient(to bottom, #fff, #64748b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* CAROUSEL */
        .hero-carousel { padding: 0 4rem; max-width: 1200px; margin: 0 auto 4rem; }
        .carousel-card { height: 400px; border-radius: 30px; display: flex; padding: 4rem; align-items: center; justify-content: space-between; overflow: hidden; position: relative; }
        .hero-info { z-index: 2; max-width: 50%; }
        .hero-info h2 { font-size: 3.5rem; line-height: 1.1; margin: 1rem 0; font-weight: 900; }
        .badge { background: var(--primary); padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 900; box-shadow: 0 0 20px var(--primary); }
        .hero-price { display: flex; align-items: center; gap: 1.5rem; margin-top: 2rem; }
        .current { font-size: 2rem; font-weight: 900; background: var(--primary); padding: 10px 25px; border-radius: 15px; }
        .old { text-decoration: line-through; color: #475569; font-size: 1.2rem; }

        .hero-image { position: relative; width: 400px; }
        .hero-image img { width: 100%; z-index: 2; position: relative; filter: drop-shadow(0 0 30px rgba(0,0,0,0.5)); }
        .glow-effect { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; background: var(--primary); filter: blur(100px); opacity: 0.4; }

        /* GRID */
        .shop-grid-container { max-width: 1400px; margin: 0 auto; padding: 0 4rem 100px; }
        .grid-header { margin-bottom: 3rem; display: flex; justify-content: center; }
        .categories { display: flex; gap: 10px; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 15px; }
        .cat-btn { background: transparent; border: none; color: #64748b; padding: 10px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .cat-btn.active { background: var(--primary); color: white; }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .p-card { border-radius: 25px; overflow: hidden; display: flex; flex-direction: column; }
        .p-img { height: 200px; background: #1a1d26; position: relative; }
        .p-badge { position: absolute; top: 15px; right: 15px; background: #f59e0b; color: black; padding: 5px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; }
        .p-details { padding: 2rem; flex: 1; display: flex; flex-direction: column; }
        .p-cat { color: var(--primary); font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .p-details h3 { font-size: 1.4rem; margin: 0.5rem 0; font-weight: 800; }
        .p-details p { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6; height: 45px; overflow: hidden; }
        .p-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
        .p-price { font-size: 1.6rem; font-weight: 900; }
        .p-buy { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; }
        .p-buy:hover { background: var(--primary); border-color: transparent; box-shadow: 0 5px 15px var(--primary-glow); }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ShopView;
