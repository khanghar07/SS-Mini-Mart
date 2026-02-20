import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Category } from "@/types";
import { categories as seedCategories } from "@/data/categories";

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const STORAGE_KEY = "freshmart-categories";
const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setCategories(seedCategories);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setCategories(Array.isArray(parsed) ? parsed : seedCategories);
    } catch {
      setCategories(seedCategories);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      // Avoid crashing the app if storage is full or unavailable.
      console.warn("Failed to save categories to localStorage.", error);
    }
  }, [categories]);

  const addCategory = (category: Category) => {
    setCategories((prev) => [category, ...prev]);
  };

  const updateCategory = (category: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === category.id ? category : c)));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const value = useMemo(() => ({ categories, addCategory, updateCategory, deleteCategory }), [categories]);

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
};
