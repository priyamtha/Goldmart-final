import React from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    totalWeight,
    taxPrice,
    totalPrice
  } = useCart();

  if (!cartOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
      />

      {/* Slide-over drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#13131a',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.8)',
        zIndex: 1001
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 10, 12, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--gold-primary)" />
            <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Your Jewellery Bag</h2>
            <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{cart.length} Items</span>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={50} color="var(--gold-dark)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Your Bag is Empty</h3>
              <p style={{ fontSize: '0.85rem' }}>Explore our BIS Hallmarked gold and diamond collections to add items.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200'}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem', lineHeight: 1.3 }}>{item.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      <span className="badge-gold" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{item.purity}</span> • {item.weightGrams}g
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
                        ₹{(item.calculatedPrice * item.qty).toLocaleString()}
                      </span>

                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.qty - 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.qty + 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.3rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(10, 10, 12, 0.95)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Total Gold Weight:</span>
              <strong style={{ color: '#fff' }}>{totalWeight.toFixed(2)} grams</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Subtotal (Metal + Making):</span>
              <strong style={{ color: '#fff' }}>₹{cartSubtotal.toLocaleString()}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Insured Shipping & Delivery:</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>FREE (Fully Insured)</span>
            </div>

            <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.8rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Grand Total</span>
                <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--gold-primary)' }}>
                  <ShieldCheck size={11} style={{ verticalAlign: 'middle' }} /> 100% BIS Hallmarked
                </span>
              </div>
              <h3 className="text-gold-gradient" style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>
                ₹{totalPrice.toLocaleString()}
              </h3>
            </div>

            <button
              onClick={() => {
                setCartOpen(false);
                if (onProceedToCheckout) onProceedToCheckout();
              }}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
