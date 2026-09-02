import React, { useState, useEffect } from 'react';
import { Package, Clock, ShieldCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function Orders({ setActivePage }) {
  const { user, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await apiFetch('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.warn('Fallback loading orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <ShieldCheck size={50} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Sign In to View Orders</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to track your hallmarked jewellery orders and transit status.</p>
        <button onClick={() => openAuthModal('login')} className="btn-gold">
          Sign In
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#10B981';
    if (status === 'Dispatched' || status === 'Out for Delivery') return '#3B82F6';
    return '#F59E0B';
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '0.4rem' }}>
        My Jewellery <span className="text-gold-gradient">Orders</span>
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
        Track your BIS hallmarked gold & diamond deliveries in real-time.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold-primary)' }}>
          Loading Your Orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} color="var(--gold-dark)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You haven't placed any jewellery orders yet.
          </p>
          <button onClick={() => setActivePage('products')} className="btn-gold">
            Explore Jewellery Catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-card" style={{ padding: '1.8rem' }}>
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.2rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600 }}>Order ID: #{order._id}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    background: `${getStatusColor(order.orderStatus)}20`,
                    color: getStatusColor(order.orderStatus),
                    border: `1px solid ${getStatusColor(order.orderStatus)}40`,
                    padding: '0.3rem 0.8rem',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    ● {order.orderStatus || 'Processing'}
                  </span>

                  <strong className="text-gold-gradient" style={{ fontSize: '1.3rem' }}>
                    ₹{order.totalPrice?.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem' }}>
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100'}
                      alt={item.name}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Purity: {item.purity} • Weight: {item.weightGrams}g • Qty: {item.qty}
                      </span>
                    </div>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Status Timeline */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>1. Order Placed</span>
                <span>➔</span>
                <span style={{ color: order.orderStatus !== 'Processing' ? 'var(--gold-primary)' : 'inherit' }}>2. Hallmarked & Certified</span>
                <span>➔</span>
                <span style={{ color: ['Dispatched', 'Out for Delivery', 'Delivered'].includes(order.orderStatus) ? 'var(--gold-primary)' : 'inherit' }}>3. Dispatched</span>
                <span>➔</span>
                <span style={{ color: order.orderStatus === 'Delivered' ? '#10B981' : 'inherit' }}>4. Delivered</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
