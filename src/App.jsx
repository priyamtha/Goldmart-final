import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import GoldCalculator from './components/GoldCalculator';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'products', 'detail', 'checkout', 'orders', 'admin', 'calculator'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <Home setActivePage={setActivePage} onSelectProduct={handleSelectProduct} />
        )}

        {activePage === 'products' && (
          <Products
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'detail' && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setActivePage('products')}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'calculator' && (
          <div className="container" style={{ padding: '3rem 1.5rem' }}>
            <GoldCalculator />
          </div>
        )}

        {activePage === 'checkout' && (
          <Checkout setActivePage={setActivePage} />
        )}

        {activePage === 'orders' && (
          <Orders setActivePage={setActivePage} />
        )}

        {activePage === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer setActivePage={setActivePage} />
      <AuthModal />
      <CartDrawer onProceedToCheckout={() => setActivePage('checkout')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
