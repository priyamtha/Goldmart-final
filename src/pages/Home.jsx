import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Gem, Calculator, Award, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import GoldCalculator from '../components/GoldCalculator';
import { apiFetch } from '../services/api';

export default function Home({ setActivePage, onSelectProduct }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiFetch('/products?featured=true');
        setFeaturedProducts(data.slice(0, 6));
      } catch (err) {
        console.warn('Fallback loading featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        padding: '5rem 1.5rem 6rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(223, 186, 103, 0.15) 0%, rgba(10, 10, 12, 1) 70%)',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.2rem'
        }} className="badge-gold">
          <Sparkles size={14} />
          <span>India’s Most Trusted Digital Jewellery Marketplace</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
          maxWidth: '900px',
          margin: '0 auto 1.2rem',
          lineHeight: 1.15,
          fontWeight: 800
        }}>
          Timeless Elegance, <span className="text-gold-gradient">Certified Purity</span> & Transparent Pricing
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.6
        }}>
          Explore BIS 916 Hallmarked 22K/24K Gold, VVS Diamond Solitaires, and 950 Platinum. Calculate real-time metal prices with zero hidden charges.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('products')}
            className="btn-gold"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}
          >
            <span>Browse Jewellery Collection</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setActivePage('calculator')}
            className="btn-outline-gold"
            style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
          >
            <Calculator size={18} />
            <span>Open Gold Calculator</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '4rem auto 0',
          padding: '1.5rem',
          background: 'rgba(23, 23, 31, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <h3 className="text-gold-gradient" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>100%</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BIS Hallmarked Gold</p>
          </div>
          <div>
            <h3 className="text-gold-gradient" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>₹7,200</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Live 24K Rate / Gram</p>
          </div>
          <div>
            <h3 className="text-gold-gradient" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>15,000+</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Satisfied Customers</p>
          </div>
          <div>
            <h3 className="text-gold-gradient" style={{ fontSize: '1.8rem', margin: 0, fontWeight: 800 }}>256-Bit</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted Checkout</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>Handcrafted Masterpieces</span>
            <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>Featured Jewellery Collections</h2>
          </div>
          <button
            onClick={() => setActivePage('products')}
            className="btn-outline-gold"
            style={{ fontSize: '0.85rem' }}
          >
            <span>View All Catalog ({featuredProducts.length}+)</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gold-primary)' }}>
            Loading Exquisite Collections...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Gold Calculator Embedded on Home */}
      <section style={{ background: 'rgba(19, 19, 26, 0.5)', padding: '3rem 1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <GoldCalculator />
        </div>
      </section>

      {/* Brand Values & Capstone Impact */}
      <section className="container" style={{ padding: '5rem 1.5rem' }}>
        <div className="glass-card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>Capstone Project Impact</span>
            <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>Solving Jewellery Retail Challenges Digitally</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Goldmart bridges the trust gap between traditional jewellery merchants and modern consumers by offering transparent weight-based price calculation, JWT authenticated accounts, Cloudinary image hosting, and MongoDB transaction management.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <ShieldCheck size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>JWT Security</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Role-based access control protecting user sessions and authorizing Seller/Admin dashboard operations.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <TrendingUp size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Dynamic Pricing API</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Real-time metal price valuation engine converting weight and Karat purity into live market costs instantly.
              </p>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Award size={32} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Cloud Image Hosting</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Integrated Cloudinary API and Multer middleware allowing store owners to upload high-res jewellery imagery smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
