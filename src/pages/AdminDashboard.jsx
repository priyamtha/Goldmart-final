import React, { useState, useEffect } from 'react';
import { Plus, Upload, Trash2, Edit3, ShieldCheck, DollarSign, Package, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'

  // Modal State for New Product
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Necklaces');
  const [purity, setPurity] = useState('22K');
  const [weightGrams, setWeightGrams] = useState(15.0);
  const [makingCharge, setMakingCharge] = useState(450);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const pData = await apiFetch('/products');
      setProducts(pData);

      if (isAdmin) {
        const oData = await apiFetch('/orders');
        setOrders(oData);
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin]);

  // Handle Cloudinary Image File Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImg(true);
    setMsg('Uploading image to Cloudinary...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiFetch('/products/upload-image', {
        method: 'POST',
        body: formData
      });
      setImageUrl(res.imageUrl);
      setMsg('✅ Image uploaded successfully to Cloudinary!');
    } catch (err) {
      setMsg(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploadingImg(false);
    }
  };

  // Submit New Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          category,
          purity,
          weightGrams: Number(weightGrams),
          makingChargePerGram: Number(makingCharge),
          description: description || 'Handcrafted 100% BIS Hallmarked Jewellery.',
          images: [imageUrl],
          stockQuantity: 10
        })
      });

      setModalOpen(false);
      resetForm();
      loadDashboardData();
    } catch (err) {
      setMsg(`Error creating product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this jewellery listing?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      loadDashboardData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          orderStatus: newStatus,
          isDelivered: newStatus === 'Delivered'
        })
      });
      loadDashboardData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Necklaces');
    setPurity('22K');
    setWeightGrams(15.0);
    setMakingCharge(450);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800');
    setMsg('');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge-gold" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Jewellery Merchant Workspace</span>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', margin: 0 }}>
            Seller <span className="text-gold-gradient">Admin Dashboard</span>
          </h1>
        </div>

        <button
          onClick={() => { resetForm(); setModalOpen(true); }}
          className="btn-gold"
          style={{ padding: '0.8rem 1.5rem' }}
        >
          <Plus size={18} />
          <span>Add New Jewellery Product</span>
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Total Active Listings</div>
          <h2 className="text-gold-gradient" style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{products.length}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Across 7 Categories</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Total Merchant Orders</div>
          <h2 className="text-gold-gradient" style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>{orders.length}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>Customer Transactions</span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Cloud Storage Uploads</div>
          <h2 className="text-gold-gradient" style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Cloudinary</h2>
          <span style={{ fontSize: '0.75rem', color: '#3B82F6' }}>Multer Memory Storage</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'products' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontWeight: activeTab === 'products' ? 700 : 500,
            paddingBottom: '0.6rem',
            borderBottom: activeTab === 'products' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Product Catalog Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'orders' ? 'var(--gold-primary)' : 'var(--text-muted)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            paddingBottom: '0.6rem',
            borderBottom: activeTab === 'orders' ? '2px solid var(--gold-primary)' : '2px solid transparent',
            cursor: 'pointer'
          }}
        >
          Customer Orders & Status ({orders.length})
        </button>
      </div>

      {/* Tab 1: Products Management Table */}
      {activeTab === 'products' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--gold-primary)' }}>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Purity</th>
                <th style={{ padding: '1rem' }}>Weight</th>
                <th style={{ padding: '1rem' }}>Making Charge</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ color: '#fff', fontWeight: 600 }}>{p.name}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{p.category}</td>
                  <td style={{ padding: '1rem' }}><span className="badge-gold">{p.purity}</span></td>
                  <td style={{ padding: '1rem', color: '#fff' }}>{p.weightGrams}g</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹{p.makingChargePerGram}/g</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.3rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Orders Status Management Table */}
      {activeTab === 'orders' && (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--gold-primary)' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Payment</th>
                <th style={{ padding: '1rem' }}>Current Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: '#fff', fontWeight: 600 }}>#{o._id}</td>
                  <td style={{ padding: '1rem', color: 'var(--gold-primary)', fontWeight: 700 }}>₹{o.totalPrice?.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{o.paymentMethod}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: o.orderStatus === 'Delivered' ? '#10B981' : '#F59E0B', fontWeight: 600 }}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                      style={{
                        padding: '0.4rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="Processing" style={{ background: '#1a1a24' }}>Processing</option>
                      <option value="Hallmarking Verified" style={{ background: '#1a1a24' }}>Hallmarking Verified</option>
                      <option value="Dispatched" style={{ background: '#1a1a24' }}>Dispatched</option>
                      <option value="Out for Delivery" style={{ background: '#1a1a24' }}>Out for Delivery</option>
                      <option value="Delivered" style={{ background: '#1a1a24' }}>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Add New Jewellery Item</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {msg && (
              <div style={{ background: 'rgba(223, 186, 103, 0.12)', border: '1px solid var(--border-color)', color: 'var(--gold-primary)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Kundan Gold Necklace"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                  >
                    {['Necklaces', 'Rings', 'Earrings', 'Watches', 'Chains', 'Coins', 'Bangles'].map((c) => (
                      <option key={c} value={c} style={{ background: '#1a1a24' }}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Purity</label>
                  <select
                    value={purity}
                    onChange={(e) => setPurity(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                  >
                    {['24K', '22K', '18K', '14K', '950 Platinum'].map((p) => (
                      <option key={p} value={p} style={{ background: '#1a1a24' }}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Making Charge (₹/g)</label>
                  <input
                    type="number"
                    required
                    value={makingCharge}
                    onChange={(e) => setMakingCharge(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Cloudinary Image File Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>
                  Upload Product Image (Cloudinary Storage)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff' }}
                />
                {imageUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img src={imageUrl} alt="preview" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{imageUrl}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '0.3rem' }}>Item Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe hallmark code, craftsmanship details..."
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingImg}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
              >
                <span>{submitting ? 'Creating Product...' : 'Publish Product to Store'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
