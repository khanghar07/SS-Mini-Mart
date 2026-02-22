import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Category } from "@/types";
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

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docIdMap, setDocIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const ref = query(collection(db, "categories"), orderBy("createdAt", "desc"));

    const syncSnapshot = (docs: Array<QueryDocumentSnapshot<DocumentData>>) => {
      const mapped: Category[] = [];
      const map: Record<string, string> = {};
      docs.forEach((snap) => {
        const data = snap.data() as Partial<Category>;
        const id = typeof data.id === "string" && data.id.trim() ? data.id : snap.id;
        mapped.push({
          id,
          name: data.name ?? "Untitled category",
          icon: data.icon ?? "??",
          imageUrl: data.imageUrl ?? "",
          createdAt:
            typeof data.createdAt === "string"
              ? data.createdAt
              : typeof data.createdAt === "object" && data.createdAt && "toDate" in data.createdAt
              ? (data.createdAt as { toDate: () => Date }).toDate().toISOString()
              : new Date().toISOString(),
        });
        map[id] = snap.id;
      });
      if (active) {
        setCategories(mapped);
        setDocIdMap(map);
        setLoading(false);
        setError(null);
      }
    };

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => syncSnapshot(snapshot.docs),
      (error) => {
        console.error("Failed to sync categories from Firestore.", error);
        if (active) {
          setCategories([]);
          setLoading(false);
          setError("Failed to sync categories.");
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const addCategory = async (category: Category) => {
    try {
      await addDoc(collection(db, "categories"), {
        id: category.id,
        name: category.name,
        icon: category.icon,
        imageUrl: category.imageUrl,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to add category to Firestore.", error);
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      const docId = docIdMap[category.id] ?? category.id;
      await updateDoc(doc(db, "categories", docId), {
        id: category.id,
        name: category.name,
        icon: category.icon,
        imageUrl: category.imageUrl,
      });
    } catch (error) {
      console.error("Failed to update category in Firestore.", error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const docId = docIdMap[categoryId] ?? categoryId;
      await deleteDoc(doc(db, "categories", docId));
    } catch (error) {
      console.error("Failed to delete category from Firestore.", error);
    }
  };

  const value = useMemo(
    () => ({ categories, loading, error, addCategory, updateCategory, deleteCategory }),
    [categories, loading, error, docIdMap]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be used within CategoryProvider");
  return ctx;
};
