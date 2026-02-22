import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Banner } from "@/types";
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

interface BannerContextType {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  addBanner: (banner: Banner) => Promise<void>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const normalizeCreatedAt = (value: unknown) => {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
};

const mapBannerDoc = (snap: QueryDocumentSnapshot<DocumentData>): Banner => {
  const data = snap.data() as Partial<Banner>;
  const id = typeof data.id === "string" && data.id.trim() ? data.id : snap.id;
  const imageUrl = data.imageUrl ?? "";
  const isActive = data.isActive ?? true;
  return {
    id,
    title: data.title ?? "Untitled banner",
    imageUrl,
    link: data.link ?? undefined,
    isActive,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
};

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docIdMap, setDocIdMap] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const ref = query(collection(db, "banners"), orderBy("createdAt", "desc"));

    const syncSnapshot = (docs: Array<QueryDocumentSnapshot<DocumentData>>) => {
      const mapped: Banner[] = [];
      const map: Record<string, string> = {};
      docs.forEach((snap) => {
        const banner = mapBannerDoc(snap);
        mapped.push(banner);
        map[banner.id] = snap.id;
      });
      if (active) {
        setBanners(mapped);
        setDocIdMap(map);
        setLoading(false);
        setError(null);
      }
    };

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => syncSnapshot(snapshot.docs),
      (error) => {
        console.error("Failed to sync banners from Firestore.", error);
        if (active) {
          setBanners([]);
          setLoading(false);
          setError("Failed to sync banners.");
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const addBanner = async (banner: Banner) => {
    try {
      await addDoc(collection(db, "banners"), {
        id: banner.id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        link: banner.link ?? null,
        isActive: banner.isActive,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to add banner to Firestore.", error);
    }
  };

  const updateBanner = async (banner: Banner) => {
    try {
      const docId = docIdMap[banner.id] ?? banner.id;
      await updateDoc(doc(db, "banners", docId), {
        id: banner.id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        link: banner.link ?? null,
        isActive: banner.isActive,
      });
    } catch (error) {
      console.error("Failed to update banner in Firestore.", error);
    }
  };

  const deleteBanner = async (bannerId: string) => {
    try {
      const docId = docIdMap[bannerId] ?? bannerId;
      await deleteDoc(doc(db, "banners", docId));
    } catch (error) {
      console.error("Failed to delete banner from Firestore.", error);
    }
  };

  const value = useMemo(
    () => ({ banners, loading, error, addBanner, updateBanner, deleteBanner }),
    [banners, loading, error, docIdMap]
  );

  return <BannerContext.Provider value={value}>{children}</BannerContext.Provider>;
};

export const useBanners = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanners must be used within BannerProvider");
  return ctx;
};
