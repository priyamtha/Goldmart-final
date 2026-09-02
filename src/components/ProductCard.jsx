import React from 'react';
import { Heart, ShoppingBag, Star, ShieldCheck, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelectProduct }) {
  const { addToCart, toggleWishlist, isInWishlist, getCalculatedPrice } = useCart();
  const calculatedPrice = getCalculatedPrice(product);
  const inWishlist = isInWishlist(product._id);

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {/* Purity & Hallmark Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <span className="badge-gold" style={{ background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(4px)' }}>
          {product.purity}
        </span>
        {product.hallmarkCertified && (
          <span style={{
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#10B981',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '2px 8px',
            borderRadius: '50px',
            fontSize: '0.65rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <ShieldCheck size={10} /> BIS 916
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 2,
          background: 'rgba(10, 10, 12, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Heart size={16} color={inWishlist ? '#EF4444' : '#fff'} fill={inWishlist ? '#EF4444' : 'none'} />
      </button>

      {/* Product Image */}
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        style={{
          height: '240px',
          overflow: 'hidden',
          position: 'relative',
          background: '#181822'
        }}
      >
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
      </div>

      {/* Content Body */}
      <div
        onClick={() => onSelectProduct && onSelectProduct(product)}
        style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FBBF24', fontSize: '0.75rem', fontWeight: 600 }}>
              <Star size={12} fill="#FBBF24" />
              <span>{product.ratings || 4.8}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.numReviews || 12})</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.6rem', lineHeight: 1.35, fontWeight: 600 }}>
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Scale size={13} color="var(--gold-primary)" />
              {product.weightGrams}g
            </span>
            <span>•</span>
            <span>Charge: ₹{product.makingChargePerGram}/g</span>
          </div>
        </div>

        {/* Price & Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Live Total Price (incl. GST)</span>
            <span className="text-gold-gradient" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              ₹{calculatedPrice.toLocaleString()}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="btn-gold"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
