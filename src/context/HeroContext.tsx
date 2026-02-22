import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

interface HeroContextType {
  heroImage: string | null;
  loading: boolean;
  error: string | null;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export const HeroProvider = ({ children }: { children: React.ReactNode }) => {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ref = query(collection(db, "hero"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const doc = snapshot.docs[0];
        const data = doc?.data() as { imageUrl?: string } | undefined;
        setHeroImage(data?.imageUrl ?? null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to sync hero image.", err);
        setHeroImage(null);
        setLoading(false);
        setError("Failed to load hero image.");
      }
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ heroImage, loading, error }), [heroImage, loading, error]);

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
};

export const useHero = () => {
  const ctx = useContext(HeroContext);
  if (!ctx) throw new Error("useHero must be used within HeroProvider");
  return ctx;
};
