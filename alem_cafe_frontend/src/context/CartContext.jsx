import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch cart from API when user logs in
  const fetchCartFromAPI = async () => {
    try {
      const res = await cartAPI.getCart();
      setCart(res.data.items);
      setTotal(res.data.total);
      setItemCount(res.data.itemCount);
      setLoading(false);
      return res.data.items;
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setLoading(false);
      return [];
    }
  };

  // Load local cart from localStorage (for guest users)
  const loadLocalCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const localCart = JSON.parse(saved);
      setCart(localCart);
      const newTotal = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newCount = localCart.reduce((sum, item) => sum + item.quantity, 0);
      setTotal(newTotal);
      setItemCount(newCount);
    }
    setLoading(false);
  };

  // Sync local cart to backend after login
  const syncLocalCart = async () => {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length > 0) {
      try {
        await cartAPI.syncCart(localCart);
        localStorage.removeItem('cart');
        await fetchCartFromAPI();
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }
    } else {
      await fetchCartFromAPI();
    }
  };

  useEffect(() => {
    if (user) {
      syncLocalCart();
    } else {
      loadLocalCart();
    }
  }, [user]);

  // Save to localStorage only for guest users
  useEffect(() => {
    if (!user && !loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user, loading]);

  const addToCart = async (item, quantity = 1) => {
    if (user) {
      try {
        const res = await cartAPI.addToCart({ menuItemId: item.id, quantity });
        setCart(res.data.items);
        setTotal(res.data.total);
        setItemCount(res.data.itemCount);
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    } else {
      setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { ...item, quantity }];
      });
      const newTotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      setTotal(newTotal);
      setItemCount(cart.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      try {
        const res = await cartAPI.removeFromCart(id);
        setCart(res.data.items);
        setTotal(res.data.total);
        setItemCount(res.data.itemCount);
      } catch (err) {
        console.error('Failed to remove from cart:', err);
      }
    } else {
      setCart(prev => prev.filter(i => i.id !== id));
      const newCart = cart.filter(i => i.id !== id);
      const newTotal = newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newCount = newCart.reduce((sum, i) => sum + i.quantity, 0);
      setTotal(newTotal);
      setItemCount(newCount);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (user) {
      try {
        const res = await cartAPI.updateQuantity({ menuItemId: id, quantity });
        setCart(res.data.items);
        setTotal(res.data.total);
        setItemCount(res.data.itemCount);
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    } else {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
      const newCart = cart.map(i => i.id === id ? { ...i, quantity } : i);
      const newTotal = newCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const newCount = newCart.reduce((sum, i) => sum + i.quantity, 0);
      setTotal(newTotal);
      setItemCount(newCount);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clearCart();
        setCart([]);
        setTotal(0);
        setItemCount(0);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setCart([]);
      setTotal(0);
      setItemCount(0);
      localStorage.removeItem('cart');
    }
  };

  return (
    <CartContext.Provider value={{
      cart, total, itemCount, loading,
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);