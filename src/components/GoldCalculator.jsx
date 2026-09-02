import React, { useState } from 'react';
import { Calculator, ShieldCheck, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function GoldCalculator() {
  const { liveGold24KRate } = useCart();
  const [purity, setPurity] = useState('22K');
  const [weight, setWeight] = useState(10); // in grams
  const [makingCharge, setMakingCharge] = useState(450); // per gram in ₹

  // Purity factors relative to 24K pure gold
  const purityMultipliers = {
    '24K': 1.0,
    '22K': 0.916,
    '18K': 0.750,
    '14K': 0.585,
    '950 Platinum': 0.65
  };

  const currentMultiplier = purityMultipliers[purity] || 0.916;
  const metalRatePerGram = Math.round(liveGold24KRate * currentMultiplier);

  const rawMetalCost = Math.round(weight * metalRatePerGram);
  const totalMaking = Math.round(weight * makingCharge);
  const subtotal = rawMetalCost + totalMaking;
  const gst = Math.round(subtotal * 0.03); // 3% GST on jewellery
  const grandTotal = subtotal + gst;

  return (
    <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ background: 'var(--gold-glow)', padding: '0.6rem', borderRadius: '10px', color: 'var(--gold-primary)' }}>
          <Calculator size={26} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Live Gold & Jewellery Price Calculator</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calculate exact market value for any custom weight, purity, and making charge.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Metal Purity Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Metal Purity / Karat
          </label>
          <select
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          >
            <option value="24K" style={{ background: '#1a1a24' }}>24K (99.9% Pure Gold)</option>
            <option value="22K" style={{ background: '#1a1a24' }}>22K (91.6% BIS Hallmarked)</option>
            <option value="18K" style={{ background: '#1a1a24' }}>18K (75.0% Fine Gold)</option>
            <option value="14K" style={{ background: '#1a1a24' }}>14K (58.5% Custom Gold)</option>
            <option value="950 Platinum" style={{ background: '#1a1a24' }}>950 Platinum</option>
          </select>
        </div>

        {/* Weight input in grams */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Weight in Grams (g)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>

        {/* Making Charge */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Making Charge (₹/gram)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            value={makingCharge}
            onChange={(e) => setMakingCharge(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      {/* Calculated Breakdown Display */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        border: '1px dashed var(--border-color)'
      }}>
        <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Applied Rate ({purity}):</span>
          <strong style={{ color: 'var(--gold-light)' }}>₹{metalRatePerGram.toLocaleString()} / gram</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
          <span>Raw Metal Cost ({weight}g):</span>
          <span>₹{rawMetalCost.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
          <span>Total Making Charges:</span>
          <span>₹{totalMaking.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem' }}>
          <span>GST (3% Government Tax):</span>
          <span>₹{gst.toLocaleString()}</span>
        </div>

        <div style={{
          height: '1px',
          background: 'var(--border-color)',
          margin: '1rem 0'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Final Estimated Price:</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <ShieldCheck size={12} /> BIS Hallmark Guaranteed
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 className="text-gold-gradient" style={{ fontSize: '2rem', margin: 0 }}>
              ₹{grandTotal.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
