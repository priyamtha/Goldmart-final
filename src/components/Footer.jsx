import React from 'react';
import { Gem, ShieldCheck, Award, Truck, RotateCcw, Lock } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{ background: '#070709', borderTop: '1px solid var(--border-color)', marginTop: '4rem', color: 'var(--text-muted)' }}>
      {/* Trust Badges Bar */}
      <div style={{ borderBottom: '1px solid var(--border-color)', padding: '2rem 0', background: 'rgba(223, 186, 103, 0.03)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={28} color="var(--gold-primary)" />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>100% BIS Hallmarked</h4>
            <p style={{ fontSize: '0.78rem' }}>Every piece bears official Government hallmark authentication.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={28} color="var(--gold-primary)" />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Certified Diamonds</h4>
            <p style={{ fontSize: '0.78rem' }}>VVS1 Clarity natural diamonds certified by GIA & IGI.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={28} color="var(--gold-primary)" />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Insured Express Transit</h4>
            <p style={{ fontSize: '0.78rem' }}>100% door-to-door transit insurance coverage on all orders.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={28} color="var(--gold-primary)" />
            <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>15-Day Exchange</h4>
            <p style={{ fontSize: '0.78rem' }}>Hassle-free 100% buyback & exchange guarantee across India.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--gold-gradient)', padding: '0.4rem', borderRadius: '8px' }}>
              <Gem size={20} color="#0d0d0d" />
            </div>
            <h3 className="text-gold-gradient" style={{ fontSize: '1.4rem', margin: 0 }}>GOLDMART</h3>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.2rem' }}>
            Goldmart is India’s premier digital platform empowering jewellery businesses and buyers with transparent bullion pricing, hallmark verification, and secure online transactions.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontSize: '0.8rem' }}>
            <Lock size={14} />
            <span>256-Bit SSL Encrypted Platform</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Collections</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Bridal Necklaces</a></li>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Solitaire Diamond Rings</a></li>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>24K Investment Gold Coins</a></li>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>950 Platinum Jewelry</a></li>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Antique Temple Earrings</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Customer Care</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li><a onClick={() => setActivePage('calculator')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Live Gold Rate Calculator</a></li>
            <li><a onClick={() => setActivePage('orders')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>Track Your Order</a></li>
            <li><a onClick={() => setActivePage('products')} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>BIS Hallmark Verification</a></li>
            <li><a style={{ color: 'inherit', textDecoration: 'none' }}>Gold Savings EMI Plan</a></li>
            <li><a style={{ color: 'inherit', textDecoration: 'none' }}>Seller Partnership</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '1rem' }}>Newsletter & Rate Alerts</h4>
          <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>Subscribe to get daily gold rate updates and exclusive bridal collection previews.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button className="btn-gold" style={{ padding: '0.6rem 1rem', fontSize: '0.82rem' }}>
              Join
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.2rem 0', textAlign: 'center', fontSize: '0.8rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p>© 2026 Goldmart Platform Development. All rights reserved.</p>
          <p style={{ color: 'var(--gold-primary)' }}>Capstone Project Showcase • React.js | Express.js | MongoDB | JWT</p>
        </div>
      </div>
    </footer>
  );
}
