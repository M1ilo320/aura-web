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
        if (data.shop) {
          setShop(data.shop);
          setProducts(data.products || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Błąd API:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div style={{color: 'white', textAlign: 'center', marginTop: '100px', fontSize: '24px'}}>Wczytywanie sklepu...</div>;
  }

  if (!shop) {
    return (
      <div style={{color: 'white', textAlign: 'center', marginTop: '100px'}}>
        <h1>Błąd 404</h1>
        <p>Sklep o nazwie <b>{slug}</b> nie istnieje w bazie danych.</p>
        <p>Upewnij się, że dodałeś go w TiDB Cloud.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0c14', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* MENU GÓRNE */}
      <div style={{ background: '#111420', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#888' }}>WRÓĆ NA {shop.name.toUpperCase()}</div>
        <div style={{ fontSize: '24px', fontWeight: '900', color: shop.accent_color || '#a855f7' }}>{shop.name}</div>
        <div style={{ background: '#1a1d29', padding: '8px 15px', borderRadius: '5px', fontSize: '12px', border: '1px solid #333' }}>ZALOGUJ PRZEZ STEAM</div>
      </div>

      {/* PASEK ZAKUPÓW */}
      <div style={{ background: '#0d0f17', padding: '10px 40px', borderBottom: '1px solid #222', display: 'flex', gap: '30px', fontSize: '13px' }}>
        <span style={{ color: '#22c55e', fontWeight: 'bold' }}>● 21 GRACZY ONLINE</span>
        <span style={{ color: '#aaa' }}>Ostatnie zakupy: <b>WarszawskiGnuciak</b> (UNBAN), <b>DzikiWSH</b> (MONETY)</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* HERO */}
        <div style={{ background: 'linear-gradient(135deg, #111420 0%, #0a0c14 100%)', borderRadius: '20px', padding: '50px', marginBottom: '40px', border: '1px solid #222', textAlign: 'center' }}>
            <h1 style={{ fontSize: '40px', margin: '0 0 10px 0' }}>SZYBKO I BEZPIECZNIE</h1>
            <p style={{ color: '#888', fontSize: '18px' }}>Ekspresowa realizacja i wygodne zakupy. Nie zwlekaj!</p>
        </div>

        {/* PRODUKTY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {products.length > 0 ? products.map((p) => (
            <div key={p.id} style={{ background: '#111420', padding: '25px', borderRadius: '15px', border: '1px solid #222' }}>
              <div style={{ fontSize: '30px', marginBottom: '10px' }}>📦</div>
              <h3 style={{ margin: '0 0 10px 0' }}>{p.name}</h3>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: shop.accent_color || '#a855f7' }}>{p.price} zł</span>
                <button style={{ background: shop.accent_color || '#a855f7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>DO KOSZYKA</button>
              </div>
            </div>
          )) : <p style={{ textAlign: 'center', width: '100%', color: '#555' }}>Brak produktów w tym sklepie.</p>}
        </div>
      </div>

    </div>
  );
};

export default ShopView;
