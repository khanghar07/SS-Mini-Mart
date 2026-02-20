import { useBanners } from "@/context/BannerContext";
import { useEffect, useMemo, useState } from "react";

const HorizontalAds = () => {
  const { banners } = useBanners();
  const active = useMemo(() => banners.filter((b) => b.isActive), [banners]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (active.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % active.length);
    }, 10000);
    return () => clearInterval(id);
  }, [active.length]);

  useEffect(() => {
    if (index >= active.length) setIndex(0);
  }, [active.length, index]);

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Sponsored</h3>
        <span className="text-[10px] uppercase tracking-widest text-ink-500">Ads</span>
      </div>
      <div className="mt-3">
        {active.length === 0 && (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-3 py-6 text-center text-xs text-ink-600">
            No ads yet. Add banners from the Admin panel.
          </div>
        )}
        {active.length > 0 && (() => {
          const banner = active[index];
          const content = (
            <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm animate-fade-in">
              <div className="w-full bg-emerald-50">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-auto object-contain" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink-900">{banner.title}</p>
              </div>
            </div>
          );

          return banner.link ? (
            <a href={banner.link} target="_blank" rel="noreferrer">
              {content}
            </a>
          ) : (
            <div>{content}</div>
          );
        })()}
        {active.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {active.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-brand-600" : "bg-emerald-200"}`}
                aria-label={`Show banner ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HorizontalAds;
