import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  image: string;
  description?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantite'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantite'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      let newItems;

      if (existingItem) {
        newItems = prevItems.map(i =>
          i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i
        );
      } else {
        newItems = [...prevItems, { ...item, quantite: 1 }];
      }

      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantite = Math.max(1, item.quantite + delta);
          return { ...item, quantite: newQuantite };
        }
        return item;
      });
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantite, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
