import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ShopView = () => {
  const { slug } = useParams();
  const [data, setData] = useState({ shop: null, products: [], recent: [], onlinePlayers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const BACKEND_URL = "https://aura-api-5tbi.onrender.com";
    
    fetch(`${BACKEND_URL}/api/shop/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Błąd");
        return res.json();
      })
      .then(json => {
        if (json.shop) {
          setData(json);
          document.documentElement.style.setProperty('--primary', json.shop.accent_color || '#a855f7');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{background: '#07080c', height: '100vh'}}></div>;
  if (error || !data.shop) return <div style={{color: 'white', textAlign: 'center', paddingTop: '100px'}}>Sklep "{slug}" nie istnieje.</div>;

  const { shop, products, recent, onlinePlayers } = data;

  return (
    <div style={{ background: '#07080c', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* NAVBAR */}
      <nav style={{ height: '80px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between', background: '#0a0b11' }}>
        <div>
            <div style={{fontSize: '10px', color: '#555', fontWeight: '800'}}>WRÓĆ NA {shop.name.toUpperCase()}</div>
            <div style={{fontSize: '22px', fontWeight: '900', color: shop.accent_color}}>{shop.name}</div>
        </div>
        <button style={{ background: '#1a1d29', border: '1px solid #333', color: 'white', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>ZALOGUJ PRZEZ STEAM</button>
      </nav>

      {/* TICKER */}
      <div style={{ background: '#0d0f17', height: '50px', display: 'flex', alignItems: 'center', padding: '0 40px', gap: '30px', borderBottom: '1px solid #222' }}>
        <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: 'bold' }}>● {onlinePlayers} GRACZY ONLINE</div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#888' }}>
            <span style={{fontWeight: '900', color: '#444'}}>OSTATNIE ZAKUPY:</span>
            {recent.map((r, i) => (
              <span key={i}><b>{r.steam_id.substring(0,8)}</b> kupił <span style={{color: shop.accent_color}}>{r.item_name}</span></span>
            ))}
        </div>
      </div>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 style={{ fontSize: '50px', fontWeight: '900', margin: 0 }}>SZYBKO I BEZPIECZNIE</h1>
            <p style={{ color: '#666', fontSize: '18px' }}>Automatyczna dostawa wprost na serwer FiveM.</p>
        </header>

        {/* PROMO CARD */}
        <div style={{ background: '#11131a', borderRadius: '32px', border: '1px solid #222', display: 'flex', overflow: 'hidden', height: '400px', marginBottom: '60px' }}>
            <div style={{ flex: 1.2, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ background: shop.accent_color, fontSize: '10px', fontWeight: '900', padding: '5px 12px', borderRadius: '6px', width: 'fit-content', marginBottom: '20px' }}>POLECANE</span>
                <h2 style={{ fontSize: '32px', margin: '0', fontWeight: '900' }}>PAKIET STARTOWY PRO</h2>
                <p style={{ color: '#777', margin: '20px 0 40px' }}>Zestaw zawiera unikalny pojazd, rangę VIP na 30 dni oraz 2500 monet.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <span style={{ fontSize: '36px', fontWeight: '900' }}>59.99 PLN</span>
                    <button style={{ background: shop.accent_color, color: 'white', border: 'none', padding: '18px 40px', borderRadius: '16px', fontWeight: '900', cursor: 'pointer' }}>KUP TERAZ</button>
                </div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)' }}></div>
        </div>

        {/* PRODUCTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ background: '#11131a', border: '1px solid #222', borderRadius: '24px', padding: '30px' }}>
              <div style={{ fontSize: '10px', fontWeight: '900', color: shop.accent_color, marginBottom: '10px' }}>{p.category}</div>
              <h3 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>{p.name}</h3>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '25px', borderTop: '1px solid #222' }}>
                <span style={{ fontSize: '24px', fontWeight: '900' }}>{p.price} PLN</span>
                <button style={{ background: 'transparent', border: '1px solid #333', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>DODAJ</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopView;
对抗
