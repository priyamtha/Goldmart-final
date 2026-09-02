import React, { useState } from 'react';
import { ShoppingBag, Heart, User, Search, Shield, LayoutDashboard, LogOut, Menu, X, Gem } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LiveRateTicker from './LiveRateTicker';

export default function Navbar({ activePage, setActivePage, searchQuery, setSearchQuery }) {
  const { user, openAuthModal, logout, isAdmin } = useAuth();
  const { cartCount, wishlist, setCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10, 10, 12, 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
      <LiveRateTicker />

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.5rem' }}>
        {/* Brand Logo */}
        <div
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--gold-gradient)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--gold-glow)'
          }}>
            <Gem size={22} color="#0d0d0d" />
          </div>
          <div>
            <h1 className="text-gold-gradient" style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1.1 }}>GOLDMART</h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Luxury Jewellery & Bullion</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'products', label: 'Jewellery Catalog' },
            { id: 'calculator', label: 'Gold Calculator' },
            { id: 'orders', label: 'My Orders' },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === link.id ? 'var(--gold-primary)' : 'var(--text-primary)',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: activePage === link.id ? 700 : 500,
                cursor: 'pointer',
                paddingBottom: '0.2rem',
                borderBottom: activePage === link.id ? '2px solid var(--gold-primary)' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {link.label}
            </button>
          ))}
          
          {isAdmin && (
            <button
              onClick={() => setActivePage('admin')}
              className="badge-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
            >
              <LayoutDashboard size={13} />
              <span>Seller Panel</span>
            </button>
          )}
        </nav>

        {/* Right Controls: Search, Wishlist, Cart, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          {/* Quick Search */}
          <div style={{ position: 'relative', width: '200px' }}>
            <input
              type="text"
              placeholder="Search 22K gold, rings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'products') setActivePage('products');
              }}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                borderRadius: '50px',
                padding: '0.4rem 0.8rem 0.4rem 2.2rem',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <Search size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setActivePage('products')}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', position: 'relative' }}
            title="Wishlist"
          >
            <Heart size={20} color={wishlist.length > 0 ? '#EF4444' : 'currentColor'} fill={wishlist.length > 0 ? '#EF4444' : 'none'} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                background: '#EF4444',
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', position: 'relative' }}
            title="Shopping Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                background: 'var(--gold-primary)',
                color: '#0d0d0d',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: 'rgba(223, 186, 103, 0.15)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50px',
                  padding: '0.3rem 0.8rem',
                  color: 'var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span>{user.name.split(' ')[0]}</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  width: '200px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  zIndex: 200
                }}>
                  <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    <span className="badge-gold" style={{ fontSize: '0.65rem', marginTop: '0.3rem', display: 'inline-block' }}>
                      {user.role === 'admin' ? 'Seller / Admin' : 'Valued Customer'}
                    </span>
                  </div>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => { setActivePage('admin'); setDropdownOpen(false); }}
                      style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--gold-primary)',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      <LayoutDashboard size={15} />
                      Seller Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => { setActivePage('orders'); setDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <ShoppingBag size={15} />
                    My Jewellery Orders
                  </button>

                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.7rem 1rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      color: '#EF4444',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="btn-gold"
              style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}
            >
              <User size={15} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
