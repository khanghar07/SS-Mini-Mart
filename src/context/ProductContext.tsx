import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/types";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  adjustStock: (items: Array<{ productId: string; quantity: number }>, mode: "deduct" | "restore") => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const mapProductDoc = (snap: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = snap.data() as Partial<Product>;
  const id = typeof data.id === "string" && data.id.trim() ? data.id : snap.id;
  const price = Number(data.price);
  const discount = Number(data.discount);
  const stock = Number(data.stock);
  const imageUrl = data.imageUrl ?? "";
  const isActive = data.isActive ?? true;
  return {
    id,
    name: data.name ?? "Untitled product",
    description: data.description ?? "",
    price: Number.isFinite(price) ? price : 0,
    discount: Number.isFinite(discount) ? discount : 0,
    categoryId: data.categoryId ?? "uncategorized",
    imageUrl,
    stock: Number.isFinite(stock) ? stock : 0,
    isActive,
  };
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docIdMap, setDocIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const ref = query(collection(db, "products"), orderBy("createdAt", "desc"));

    const syncSnapshot = (docs: Array<QueryDocumentSnapshot<DocumentData>>) => {
      const mapped: Product[] = [];
      const map: Record<string, string> = {};
      docs.forEach((snap) => {
        const product = mapProductDoc(snap);
        mapped.push(product);
        map[product.id] = snap.id;
      });
      if (active) {
        setProducts(mapped);
        setDocIdMap(map);
        setLoading(false);
        setError(null);
      }
    };

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => syncSnapshot(snapshot.docs),
      (error) => {
        console.error("Failed to sync products from Firestore.", error);
        if (active) {
          setProducts([]);
          setLoading(false);
          setError("Failed to sync products.");
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      await addDoc(collection(db, "products"), {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        stock: product.stock,
        isActive: product.isActive,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to add product to Firestore.", error);
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const docId = docIdMap[product.id] ?? product.id;
      await updateDoc(doc(db, "products", docId), {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        stock: product.stock,
        isActive: product.isActive,
      });
    } catch (error) {
      console.error("Failed to update product in Firestore.", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const docId = docIdMap[productId] ?? productId;
      await deleteDoc(doc(db, "products", docId));
    } catch (error) {
      console.error("Failed to delete product from Firestore.", error);
    }
  };

  const adjustStock = async (items: Array<{ productId: string; quantity: number }>, mode: "deduct" | "restore") => {
    const deltaByProductId = new Map<string, number>();
    items.forEach((item) => {
      const existing = deltaByProductId.get(item.productId) ?? 0;
      deltaByProductId.set(item.productId, existing + item.quantity);
    });

    await Promise.all(
      products.map(async (product) => {
        const change = deltaByProductId.get(product.id);
        if (!change) return;
        const delta = mode === "deduct" ? -change : change;
        const nextStock = Math.max(0, product.stock + delta);
        try {
          const docId = docIdMap[product.id] ?? product.id;
          await updateDoc(doc(db, "products", docId), { stock: nextStock });
        } catch (error) {
          console.error(`Failed to adjust stock for product ${product.id}.`, error);
        }
      })
    );
  };

  const value = useMemo(
    () => ({ products, loading, error, addProduct, updateProduct, deleteProduct, adjustStock }),
    [products, loading, error, docIdMap]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
