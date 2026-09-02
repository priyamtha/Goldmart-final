import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Scale, Star, ShieldCheck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { apiFetch } from '../services/api';

export default function Products({ searchQuery, setSearchQuery, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPurity, setSelectedPurity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', 'Necklaces', 'Rings', 'Earrings', 'Watches', 'Chains', 'Coins', 'Bangles'];
  const purities = ['All', '24K', '22K', '18K', '14K', '950 Platinum'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let queryParams = `?sort=${sortBy}`;
        if (selectedCategory !== 'All') queryParams += `&category=${selectedCategory}`;
        if (selectedPurity !== 'All') queryParams += `&purity=${selectedPurity}`;
        if (searchQuery) queryParams += `&search=${encodeURIComponent(searchQuery)}`;

        const data = await apiFetch(`/products${queryParams}`);
        setProducts(data);
      } catch (err) {
        console.warn('Fallback loading products list');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedPurity, sortBy, searchQuery]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '0.4rem' }}>
          Jewellery <span className="text-gold-gradient">Catalog</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Explore 100% BIS Hallmarked gold, diamond solitaire, and investment grade bullion items.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '50px',
              border: selectedCategory === cat ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
              background: selectedCategory === cat ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
              color: selectedCategory === cat ? '#0d0d0d' : 'var(--text-primary)',
              fontWeight: selectedCategory === cat ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters & Sorting Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.2rem',
        marginBottom: '2rem',
        background: 'rgba(19, 19, 26, 0.6)',
        padding: '1rem 1.2rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Purity Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={14} /> Purity:
          </span>
          {purities.map((pur) => (
            <button
              key={pur}
              onClick={() => setSelectedPurity(pur)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '6px',
                border: 'none',
                background: selectedPurity === pur ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                color: selectedPurity === pur ? '#0d0d0d' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {pur}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SlidersHorizontal size={14} color="var(--gold-primary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.45rem 0.8rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.85rem'
            }}
          >
            <option value="newest" style={{ background: '#1a1a24' }}>Newest Arrivals</option>
            <option value="price_asc" style={{ background: '#1a1a24' }}>Weight: Low to High</option>
            <option value="price_desc" style={{ background: '#1a1a24' }}>Weight: High to Low</option>
            <option value="rating" style={{ background: '#1a1a24' }}>Top Rated</option>
          </select>
        </div>
      </div>

      {/* Search status indicator */}
      {searchQuery && (
        <div style={{ marginBottom: '1.5rem', color: 'var(--gold-primary)', fontSize: '0.9rem' }}>
          Showing search results for: <strong>"{searchQuery}"</strong> ({products.length} found)
          <button
            onClick={() => setSearchQuery('')}
            style={{ marginLeft: '0.8rem', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--gold-primary)' }}>
          Fetching Jewellery Catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Scale size={48} color="var(--gold-dark)" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Try resetting your filters or adjusting your search term.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedPurity('All'); setSearchQuery(''); }}
            className="btn-gold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
