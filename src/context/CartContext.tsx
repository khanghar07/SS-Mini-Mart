import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notification: string | null;
  clearNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const DELIVERY_FEE = 100;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const notificationTimeout = useRef<number | null>(null);

  const clearNotification = () => {
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current);
      notificationTimeout.current = null;
    }
    setNotification(null);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current);
    }
    notificationTimeout.current = window.setTimeout(() => {
      setNotification(null);
      notificationTimeout.current = null;
    }, 2000);
  };

  useEffect(() => () => clearNotification(), []);

  const addToCart = async (product: Product, quantity = 1) => {
    if (product.stock === 0) return;
    try {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stock);
          return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: nextQty } : i));
        }
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      });
      showNotification("Product added to cart");
    } catch (error) {
      console.error("Failed to add to cart.", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } catch (error) {
      console.error("Failed to remove from cart.", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    try {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.min(quantity, i.product.stock) }
            : i
        )
      );
    } catch (error) {
      console.error("Failed to update cart quantity.", error);
    }
  };

  const clearCart = async () => {
    try {
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart.", error);
    }
  };

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(() =>
    items.reduce((sum, i) => {
      const price = i.product.discount > 0 ? i.product.price * (1 - i.product.discount / 100) : i.product.price;
      return sum + price * i.quantity;
    }, 0), [items]);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, deliveryFee, total, notification, clearNotification }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
