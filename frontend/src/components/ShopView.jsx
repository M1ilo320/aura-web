import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, User, Users, ChevronLeft, ChevronRight, Zap, Shield, Star, Crown } from 'lucide-react';
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
    const BACKEND_URL = "https://aura-api-5tbi.onrender.com";
    
    fetch(`${BACKEND_URL}/api/shop/${slug}`)
      .then(res => res.json())
      .then(data => {
        setShop(data.shop);
        setProducts(data.products);
        if (data.shop.accent_color) {
            document.documentElement.style.setProperty('--primary', data.shop.accent_color);
            document.documentElement.style.setProperty('--primary-glow', data.shop.accent_color + '80');
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [slug]);

  if (loading) return <div className="loading-container"><h1>AuraStore</h1><div className="loader"></div></div>;
  if (!shop) return <div className="error-screen">Sklep nie istnieje.</div>;

  return (
    <div className="aura-wrapper">
      {/* HEADER / TICKER */}
      <div className="purchase-ticker glass">
        <div className="ticker-content">
          <div className="online-count">
            <div className="pulse-dot"></div>
            <span>47 GRACZY ONLINE</span>
          </div>
          <div className="ticker-items">
            <AnimatePresence>
              {purchases.map((p, i) => (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="ticker-card"
                >
                  <span className="user">{p.user}</span>
                  <span className="item">{p.item}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button className="steam-btn">ZALOGUJ PRZEZ STEAM</button>
        </div>
      </div>

      {/* SHOP NAME */}
      <header className="shop-header">
        <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {shop.name}
        </motion.h1>
      </header>

      {/* HERO SECTION */}
      <section className="hero-carousel">
        <div className="carousel-card glass">
           <div className="hero-info">
             <div className="badge"><Star size={12} fill="currentColor"/> POLECANE</div>
             <h2>ZESTAW STARTER</h2>
             <p>Wszystko czego potrzebujesz na start: Monety, Unikalne Auto oraz Ranga VIP na 30 dni.</p>
             <div className="hero-price">
               <div className="price-tag">
                 <span className="current-price">49.99 PLN</span>
                 <span className="old-price">89.00 PLN</span>
               </div>
               <button className="buy-hero-btn">BIORĘ TO!</button>
             </div>
           </div>
           <div className="hero-image">
             <img src="https://cdna.artstation.com/p/assets/images/images/034/136/836/large/lucas-f-neon-box.jpg?1611270213" alt="Starter Pack" />
           </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="shop-content">
        <div className="category-bar">
            <button className="cat-btn active">WSZYSTKO</button>
            <button className="cat-btn">RANGI</button>
            <button className="cat-btn">WALUTA</button>
            <button className="cat-btn">INNE</button>
        </div>

        <div className="product-grid">
          {products.map((p, i) => (
            <motion.div 
              key={p.id} 
              className="p-card glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="p-header">
                {p.item_type === 'rangi' ? <Crown className="p-icon" size={40}/> : <Zap className="p-icon" size={40}/>}
                {p.popular && <span className="p-popular">BESTSELLER</span>}
              </div>
              <div className="p-body">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
              <div className="p-footer">
                 <span className="p-price">{p.price} PLN</span>
                 <button className="p-buy">DODAJ DO KOSZYKA</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .loading-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
        .loader { width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .shop-header { text-align: center; margin: 40px 0; }
        .shop-header h1 { font-size: 3rem; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
        
        .category-bar { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
        .price-tag { display: flex; flex-direction: column; }
        .old-price { text-decoration: line-through; color: var(--text-dim); font-size: 0.9rem; }
        
        .p-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .p-icon { color: var(--primary); filter: drop-shadow(0 0 10px var(--primary-glow)); }
        .p-popular { background: #f59e0b; color: #000; font-size: 0.6rem; font-weight: 900; padding: 4px 8px; border-radius: 6px; }
      `}} />
    </div>
  );
};

export default ShopView;
对抗
