import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { restaurantService } from '../services/restaurantApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [serverCartReady, setServerCartReady] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('restaurant_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current active order being checked out in "My Bills"
  const [checkoutOrder, setCheckoutOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('restaurant_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    let active = true;
    setServerCartReady(false);
    if (user?.role !== 'customer') return () => { active = false; };

    restaurantService.getCart().then(async (serverCart) => {
      if (!active) return;
      const merged = [...serverCart.items];
      for (const localItem of cartItems) {
        const existing = merged.find(item => item.id === localItem.id);
        if (existing) existing.quantity = Math.min(99, existing.quantity + localItem.quantity);
        else merged.push(localItem);
      }
      setCartItems(merged);
      await restaurantService.syncCart(merged);
      if (active) setServerCartReady(true);
    }).catch(() => {
      if (active) setServerCartReady(true);
    });

    return () => { active = false; };
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (user?.role !== 'customer' || !serverCartReady) return undefined;
    const timer = setTimeout(() => {
      restaurantService.syncCart(cartItems).catch(() => {});
    }, 180);
    return () => clearTimeout(timer);
  }, [cartItems, serverCartReady, user?.role]);

  const addToCart = (food, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === food.id);
      if (existing) {
        return prev.map(item =>
          item.id === food.id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item
        );
      }
      return [...prev, { ...food, quantity: Math.min(99, quantity) }];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => prev.filter(item => item.id !== foodId));
  };

  const updateQuantity = (foodId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalCount,
      totalAmount,
      checkoutOrder,
      setCheckoutOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
