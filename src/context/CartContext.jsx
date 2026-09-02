import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('goldmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('goldmart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);

  // Live metal rate per gram (24K Gold baseline = ₹7200)
  const [liveGold24KRate, setLiveGold24KRate] = useState(7200);

  useEffect(() => {
    localStorage.setItem('goldmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('goldmart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Helper to calculate exact item price based on metal purity and weight
  const getCalculatedPrice = (item) => {
    let multiplier = 1.0;
    if (item.purity === '22K') multiplier = 0.916;
    if (item.purity === '18K') multiplier = 0.750;
    if (item.purity === '14K') multiplier = 0.585;
    if (item.purity === '950 Platinum') multiplier = 0.65;

    const rawMetalCost = item.weightGrams * (liveGold24KRate * multiplier);
    const makingCharge = item.weightGrams * (item.makingChargePerGram || 450);
    const subtotal = rawMetalCost + makingCharge;
    const gst = subtotal * 0.03;
    return Math.round(subtotal + gst);
  };

  const addToCart = (product, qty = 1) => {
    const unitPrice = getCalculatedPrice(product);
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i._id === product._id);
      if (existing) {
        return prevCart.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + qty, calculatedPrice: unitPrice } : i
        );
      }
      return [...prevCart, { ...product, qty, calculatedPrice: unitPrice }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => prevCart.map((i) => (i._id === id ? { ...i, qty } : i)));
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((i) => i._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i._id === product._id);
      if (exists) return prev.filter((i) => i._id !== product._id);
      return [...prev, product];
    });
  };

  // Cart summary breakdown
  const cartSubtotal = cart.reduce((sum, item) => sum + item.calculatedPrice * item.qty, 0);
  const totalWeight = cart.reduce((sum, item) => sum + item.weightGrams * item.qty, 0);
  const taxPrice = Math.round(cartSubtotal * 0.03);
  const totalPrice = cartSubtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartOpen,
        setCartOpen,
        liveGold24KRate,
        setLiveGold24KRate,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist: (id) => wishlist.some((i) => i._id === id),
        getCalculatedPrice,
        cartSubtotal,
        totalWeight,
        taxPrice,
        totalPrice,
        cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
