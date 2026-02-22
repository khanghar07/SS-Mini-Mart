import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Order, OrderStatus, StockAdjusted } from "@/types";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  markStockAdjusted: (orderId: string, value: StockAdjusted) => Promise<void>;
  getOrderByIdAndPhone: (orderId: string, phone: string) => Order | undefined;
  deleteOrder: (orderId: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const normalizeCreatedAt = (value: unknown) => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const mapOrderDoc = (snap: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = snap.data() as Partial<Order>;
  const orderId = typeof data.orderId === "string" && data.orderId.trim() ? data.orderId : snap.id;
  const total = Number((data as { total?: number }).total ?? data.totalAmount);
  const subtotal = Number(data.subtotal);
  const deliveryFee = Number(data.deliveryFee);
  return {
    id: orderId,
    orderId,
    firestoreId: snap.id,
    customerName: data.customerName ?? "Guest",
    phone: data.phone ?? "",
    address: data.address ?? "",
    notes: data.notes ?? "",
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: Number.isFinite(subtotal) ? subtotal : 0,
    deliveryFee: Number.isFinite(deliveryFee) ? deliveryFee : 0,
    total: Number.isFinite(total) ? total : 0,
    totalAmount: Number.isFinite(total) ? total : 0,
    status: (data.status as OrderStatus) ?? "Pending",
    paymentMethod: data.paymentMethod ?? "Cash on Delivery",
    userId: data.userId ?? undefined,
    createdAt: normalizeCreatedAt(data.createdAt),
    updatedAt: data.updatedAt ?? normalizeCreatedAt(data.createdAt),
    stockAdjusted: data.stockAdjusted ?? "none",
  };
};

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const ref = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const syncSnapshot = (docs: Array<QueryDocumentSnapshot<DocumentData>>) => {
      const mapped = docs.map(mapOrderDoc);
      if (active) {
        setOrders(mapped);
        setLoading(false);
        setError(null);
      }
    };

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => syncSnapshot(snapshot.docs),
      (error) => {
        console.error("Failed to sync orders from Firestore.", error);
        if (active) {
          setOrders([]);
          setLoading(false);
          setError("Failed to sync orders.");
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === "Cancelled" || o.status === "Delivered") return o;
        return { ...o, status, updatedAt: new Date().toISOString() };
      })
    );

    try {
      const docId = orders.find((o) => o.id === orderId)?.firestoreId ?? orderId;
      await updateDoc(doc(db, "orders", docId), { status });
    } catch (error) {
      console.error(`Failed to update order ${orderId} status.`, error);
    }
  };

  const markStockAdjusted = async (orderId: string, value: StockAdjusted) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, stockAdjusted: value } : o)));
    try {
      const docId = orders.find((o) => o.id === orderId)?.firestoreId ?? orderId;
      await updateDoc(doc(db, "orders", docId), { stockAdjusted: value });
    } catch (error) {
      console.error(`Failed to update order ${orderId} stock adjustment.`, error);
    }
  };

  const getOrderByIdAndPhone = (orderId: string, phone: string) =>
    orders.find((o) => o.id.toLowerCase() === orderId.toLowerCase() && o.phone === phone);

  const deleteOrder = async (orderId: string) => {
    try {
      const docId = orders.find((o) => o.id === orderId)?.firestoreId ?? orderId;
      await deleteDoc(doc(db, "orders", docId));
    } catch (error) {
      console.error(`Failed to delete order ${orderId}.`, error);
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, loading, error, updateOrderStatus, markStockAdjusted, getOrderByIdAndPhone, deleteOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
};
