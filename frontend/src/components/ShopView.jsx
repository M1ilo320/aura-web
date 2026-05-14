import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TWOJE API Z RENDERA
    const BACKEND_URL = "https://aura-api-5tbi.onrender.com";
    
    console.log("Łączenie z:", `${BACKEND_URL}/api/shop/${slug}`);

    fetch(`${BACKEND_URL}/api/shop/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Błąd serwera");
        return res.json();
      })
      .then(data => {
        setShop(data.shop);
        setProducts(data.products);
        if (data.shop.accent_color) {
            document.documentElement.style.setProperty('--primary', data.shop.accent_color);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Błąd pobierania:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="loading-container">
      <h1>AuraStore</h1>
      <div className="loader"></div>
      <p>Wczytywanie sklepu...</p>
    </div>
  );

  if (!shop) return (
    <div className="error-screen">
      <h1>404</h1>
      <p>Sklep o nazwie "{slug}" nie został znaleziony.</p>
      <a href="/" style={{color: 'white'}}>Wróć do strony głównej</a>
    </div>
  );

  return (
    <div className="aura-wrapper">
      <header className="shop-header">
        <h1>{shop.name}</h1>
      </header>

      <section className="hero-card">
        <div className="hero-info">
          <span style={{color: 'var(--primary)', fontWeight: 800}}>POLECANE</span>
          <h2>ZESTAW STARTER</h2>
          <p>Najlepszy wybór na początek przygody.</p>
          <div className="hero-price">49.99 PLN</div>
          <button className="buy-hero-btn">KUP TERAZ</button>
        </div>
        <div className="hero-img">
            {/* Obrazek opcjonalny */}
        </div>
      </section>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="p-card">
            <span style={{fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800}}>{p.category}</span>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <span className="p-price">{p.price} PLN</span>
            <button className="p-buy">DODAJ DO KOSZYKA</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopView;
