import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register, googleLogin, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      const res = await login(email, password);
      if (!res.success) setError(res.message);
    } else {
      if (!name) return setError('Please enter your full name');
      const res = await register(name, email, password, role);
      if (!res.success) setError(res.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const res = await googleLogin({
      name: 'Google User',
      email: 'user.google@goldmart.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    });
    if (!res.success) setError(res.message);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative' }}>
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.3rem' }}>
            {authMode === 'login' ? 'Welcome Back' : 'Create Goldmart Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {authMode === 'login' ? 'Sign in to access your wishlist, cart & orders' : 'Join Goldmart for hallmark certified gold & diamond jewellery'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => { setAuthMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              background: authMode === 'login' ? 'var(--gold-gradient)' : 'none',
              color: authMode === 'login' ? '#0d0d0d' : 'var(--text-muted)',
              fontWeight: 700,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              background: authMode === 'register' ? 'var(--gold-gradient)' : 'none',
              color: authMode === 'register' ? '#0d0d0d' : 'var(--text-muted)',
              fontWeight: 700,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyamtha Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.4rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <option value="customer" style={{ background: '#1a1a24' }}>Customer (Buyer)</option>
                <option value="admin" style={{ background: '#1a1a24' }}>Seller / Admin (Jewellery Store)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            <ShieldCheck size={16} />
            <span>{loading ? 'Processing...' : authMode === 'login' ? 'Sign In with JWT' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.2rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ padding: '0 0.8rem' }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* Google OAuth button */}
        <button
          onClick={handleGoogleSignIn}
          className="btn-outline-gold"
          style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
        >
          <Chrome size={18} color="#4285F4" />
          <span>Sign In with Google</span>
        </button>

        {/* Quick Demo Credentials helper */}
        <div style={{ marginTop: '1.2rem', padding: '0.6rem', background: 'rgba(223, 186, 103, 0.08)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          💡 <strong>Demo Seller Login:</strong> Email: <code>admin@goldmart.com</code> | Pass: <code>admin123</code>
        </div>
      </div>
    </div>
  );
}
