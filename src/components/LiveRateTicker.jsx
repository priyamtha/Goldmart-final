import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function LiveRateTicker() {
  const { liveGold24KRate } = useCart();
  const [tickerOffset, setTickerOffset] = useState(0);

  const rate22K = Math.round(liveGold24KRate * 0.916);
  const rate18K = Math.round(liveGold24KRate * 0.750);
  const rateSilver = 88;

  return (
    <div style={{
      background: 'linear-gradient(90deg, #13131a 0%, #1c1c28 50%, #13131a 100%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.4rem 1rem',
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
          <ShieldCheck size={15} />
          <span>100% BIS Hallmarked Pure Gold</span>
        </div>

        <div style={{ height: '12px', width: '1px', background: 'var(--border-color)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} color="#10B981" />
          <span>24K Gold: <strong style={{ color: '#fff' }}>₹{liveGold24KRate.toLocaleString()}/g</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} color="#10B981" />
          <span>22K Gold: <strong style={{ color: '#fff' }}>₹{rate22K.toLocaleString()}/g</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} color="#10B981" />
          <span>18K Gold: <strong style={{ color: '#fff' }}>₹{rate18K.toLocaleString()}/g</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <TrendingUp size={14} color="#10B981" />
          <span>Silver: <strong style={{ color: '#fff' }}>₹{rateSilver}/g</strong></span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.78rem' }}>
        <RefreshCw size={12} className="pulse-gold" />
        <span>Live Bullion Market Rates</span>
      </div>
    </div>
  );
}
