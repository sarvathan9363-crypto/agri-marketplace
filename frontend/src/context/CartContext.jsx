import { createContext, useContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, isBuyer } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isBuyer) {
      fetchCart();
    }
  }, [isAuthenticated, isBuyer]);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.cart);
      setCartCount(data.cart.items?.length || 0);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId, quantity) => {
    const data = await cartService.addToCart(productId, quantity);
    setCart(data.cart);
    setCartCount(data.cart.items?.length || 0);
    return data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const data = await cartService.updateCartItem(itemId, quantity);
    setCart(data.cart);
    setCartCount(data.cart.items?.length || 0);
    return data;
  };

  const removeFromCart = async (itemId) => {
    const data = await cartService.removeFromCart(itemId);
    setCart(data.cart);
    setCartCount(data.cart.items?.length || 0);
    return data;
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ items: [], totalAmount: 0 });
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
