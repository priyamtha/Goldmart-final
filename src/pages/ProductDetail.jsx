import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Heart, ShoppingBag, Star, Scale, Award, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetail({ product, onBack, setActivePage }) {
  const { addToCart, toggleWishlist, isInWishlist, getCalculatedPrice, liveGold24KRate } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const calculatedPrice = getCalculatedPrice(product);
  const inWishlist = isInWishlist(product._id);

  // Price component calculations
  let multiplier = 1.0;
  if (product.purity === '22K') multiplier = 0.916;
  if (product.purity === '18K') multiplier = 0.750;
  if (product.purity === '14K') multiplier = 0.585;
  if (product.purity === '950 Platinum') multiplier = 0.65;

  const metalRate = Math.round(liveGold24KRate * multiplier);
  const rawMetalCost = Math.round(product.weightGrams * metalRate);
  const totalMaking = Math.round(product.weightGrams * (product.makingChargePerGram || 450));
  const gst = Math.round((rawMetalCost + totalMaking) * 0.03);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--gold-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={18} />
        <span>Back to Jewellery Catalog</span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div className="glass-card" style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', marginBottom: '1rem', height: '420px' }}>
            <img
              src={product.images && product.images[selectedImg] ? product.images[selectedImg] : product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImg === idx ? '2px solid var(--gold-primary)' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Pricing */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span className="badge-gold">{product.purity}</span>
            <span className="badge-gold" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{product.category}</span>
            {product.hallmarkCertified && (
              <span style={{ color: '#10B981', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={14} /> BIS Hallmarked
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.8rem', lineHeight: 1.25 }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: '#FBBF24', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={16} fill="#FBBF24" />
              <strong style={{ color: '#fff' }}>{product.ratings}</strong>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>({product.numReviews} Verified Buyer Reviews)</span>
          </div>

          {/* Dynamic Calculated Price Display */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.8rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Calculated Total (Live Market Valuation)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <h2 className="text-gold-gradient" style={{ fontSize: '2.5rem', margin: 0, fontWeight: 900 }}>
                ₹{calculatedPrice.toLocaleString()}
              </h2>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 600 }}>Includes 3% GST</span>
            </div>

            {/* Price Breakdown Accordion / Details */}
            <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Metal Weight ({product.weightGrams}g @ ₹{metalRate}/g):</span>
                <strong style={{ color: '#fff' }}>₹{rawMetalCost.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Making Charges (₹{product.makingChargePerGram}/g):</span>
                <strong style={{ color: '#fff' }}>₹{totalMaking.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Government GST Tax (3%):</span>
                <strong style={{ color: '#fff' }}>₹{gst.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Hallmark Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(223, 186, 103, 0.08)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
            <Award size={20} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)' }}>
              BIS Unique Hallmark ID: <strong>{product.bisCode || 'HM-GOLD-916'}</strong>
            </span>
          </div>

          {/* Actions Bar */}
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <button
              onClick={handleAddToCart}
              className="btn-gold"
              style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            >
              <ShoppingBag size={18} />
              <span>{addedNotice ? 'Added to Cart!' : 'Add to Jewellery Bag'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: inWishlist ? '#EF4444' : '#fff',
                cursor: 'pointer'
              }}
            >
              <Heart size={20} fill={inWishlist ? '#EF4444' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
