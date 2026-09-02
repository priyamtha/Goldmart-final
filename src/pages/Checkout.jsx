import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Landmark, Truck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function Checkout({ setActivePage }) {
  const { cart, cartSubtotal, taxPrice, totalPrice, liveGold24KRate, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();

  const [street, setStreet] = useState('102 Gold Avenue, Bandra West');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400050');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [error, setError] = useState('');

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Your Bag is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please add jewellery products to your bag before proceeding to checkout.</p>
        <button onClick={() => setActivePage('products')} className="btn-gold">
          Browse Jewellery Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);

    const orderPayload = {
      orderItems: cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.images ? item.images[0] : '',
        purity: item.purity,
        weightGrams: item.weightGrams,
        price: item.calculatedPrice,
        qty: item.qty
      })),
      shippingAddress: { street, city, state, pincode, country: 'India' },
      paymentMethod,
      goldRateApplied: liveGold24KRate,
      itemsPrice: cartSubtotal,
      taxPrice,
      totalPrice
    };

    try {
      const created = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });
      setOrderPlaced(created);
      clearCart();
    } catch (err) {
      setError(err.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '2rem' }}>
        Secure <span className="text-gold-gradient">Checkout</span>
      </h1>

      {orderPlaced ? (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem auto', padding: '3rem', textAlign: 'center' }}>
          <CheckCircle2 size={64} color="#10B981" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Thank you, {user?.name}! Your jewellery order <strong>#{orderPlaced._id}</strong> has been registered. Our master hallmarking team is preparing your package.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Total Amount:</span>
              <strong style={{ color: 'var(--gold-primary)' }}>₹{orderPlaced.totalPrice?.toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Applied Gold Rate:</span>
              <span>₹{orderPlaced.goldRateApplied}/g</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Payment Mode:</span>
              <span>{orderPlaced.paymentMethod}</span>
            </div>
          </div>

          <button onClick={() => setActivePage('orders')} className="btn-gold" style={{ padding: '0.8rem 2rem' }}>
            Track Order Status
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Left Form */}
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Shipping Address */}
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                <Truck size={20} color="var(--gold-primary)" />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Insured Shipping Address</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Street Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card" style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                <CreditCard size={20} color="var(--gold-primary)" />
                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>Payment Method</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  { id: 'UPI', label: 'Instant UPI (GooglePay / PhonePe / Paytm)', icon: Landmark },
                  { id: 'Credit/Debit Card', label: 'Credit / Debit Card (Visa, Mastercard, RuPay)', icon: CreditCard },
                  { id: 'Gold Savings EMI', label: 'Goldmart Monthly Savings EMI Plan', icon: ShieldCheck },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (Insured Parcel)', icon: Truck }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.8rem 1rem',
                      background: paymentMethod === pm.id ? 'rgba(223, 186, 103, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: paymentMethod === pm.id ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                    />
                    <pm.icon size={18} color="var(--gold-primary)" />
                    <span style={{ fontSize: '0.9rem', color: '#fff' }}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', padding: '0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            >
              <Lock size={18} />
              <span>{loading ? 'Securing Transaction...' : `Confirm & Pay ₹${totalPrice.toLocaleString()}`}</span>
            </button>
          </form>

          {/* Right Summary Sidebar */}
          <div>
            <div className="glass-card" style={{ padding: '1.8rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                Order Summary ({cart.length} Items)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem', maxHeight: '240px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{item.qty}x</span>
                      <span style={{ color: '#fff' }}>{item.name}</span>
                    </div>
                    <strong style={{ color: 'var(--gold-light)' }}>₹{(item.calculatedPrice * item.qty).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Subtotal:</span>
                <strong style={{ color: '#fff' }}>₹{cartSubtotal.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>GST (3% Govt Tax):</span>
                <strong style={{ color: '#fff' }}>₹{taxPrice.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Transit Insurance:</span>
                <span style={{ color: '#10B981', fontWeight: 600 }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '1rem', color: '#fff', fontWeight: 700 }}>Total Payable:</span>
                <h3 className="text-gold-gradient" style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900 }}>
                  ₹{totalPrice.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
