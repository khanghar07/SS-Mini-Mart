import React, { createContext, useContext, useEffect, useState } from "react";
import { Order, OrderStatus, StockAdjusted } from "@/types";
import { sampleOrders } from "@/data/orders";

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markStockAdjusted: (orderId: string, value: StockAdjusted) => void;
  getOrderByIdAndPhone: (orderId: string, phone: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const STORAGE_KEY = "freshmart-orders";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setOrders(sampleOrders);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setOrders(Array.isArray(parsed) ? parsed : sampleOrders);
    } catch {
      setOrders(sampleOrders);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      // Avoid crashing the app if storage is full or unavailable.
      console.warn("Failed to save orders to localStorage.", error);
    }
  }, [orders]);

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === "Cancelled" || o.status === "Delivered") return o;
        return { ...o, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const markStockAdjusted = (orderId: string, value: StockAdjusted) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, stockAdjusted: value } : o)));
  };

  const getOrderByIdAndPhone = (orderId: string, phone: string) =>
    orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase() && o.phone === phone);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, markStockAdjusted, getOrderByIdAndPhone }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
