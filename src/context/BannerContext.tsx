import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Banner } from "@/types";
import { banners as seedBanners } from "@/data/banners";

interface BannerContextType {
  banners: Banner[];
  addBanner: (banner: Banner) => void;
  updateBanner: (banner: Banner) => void;
  deleteBanner: (bannerId: string) => void;
}

const STORAGE_KEY = "freshmart-banners";
const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setBanners(seedBanners);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setBanners(Array.isArray(parsed) ? parsed : seedBanners);
    } catch {
      setBanners(seedBanners);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
    } catch (error) {
      // Avoid crashing the app if storage is full or unavailable.
      console.warn("Failed to save banners to localStorage.", error);
    }
  }, [banners]);

  const addBanner = (banner: Banner) => {
    setBanners((prev) => [banner, ...prev]);
  };

  const updateBanner = (banner: Banner) => {
    setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
  };

  const deleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

  const value = useMemo(() => ({ banners, addBanner, updateBanner, deleteBanner }), [banners]);

  return <BannerContext.Provider value={value}>{children}</BannerContext.Provider>;
};

export const useBanners = () => {
  const ctx = useContext(BannerContext);
  if (!ctx) throw new Error("useBanners must be used within BannerProvider");
  return ctx;
};
