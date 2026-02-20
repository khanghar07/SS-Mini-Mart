import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/types";
import { products as seedProducts } from "@/data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  adjustStock: (items: Array<{ productId: string; quantity: number }>, mode: "deduct" | "restore") => void;
}

const STORAGE_KEY = "freshmart-products";
const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setProducts(seedProducts);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setProducts(Array.isArray(parsed) ? parsed : seedProducts);
    } catch {
      setProducts(seedProducts);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      // Avoid crashing the app if storage is full or unavailable.
      console.warn("Failed to save products to localStorage.", error);
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const adjustStock = (items: Array<{ productId: string; quantity: number }>, mode: "deduct" | "restore") => {
    setProducts((prev) =>
      prev.map((p) => {
        const match = items.find((i) => i.productId === p.id);
        if (!match) return p;
        const delta = mode === "deduct" ? -match.quantity : match.quantity;
        return { ...p, stock: Math.max(0, p.stock + delta) };
      })
    );
  };

  const value = useMemo(() => ({ products, addProduct, updateProduct, deleteProduct, adjustStock }), [products]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
