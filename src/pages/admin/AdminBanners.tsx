import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useBanners } from "@/context/BannerContext";
import { fileToDataUrl } from "@/lib/file";
import type { Banner } from "@/types";

const emptyForm = {
  id: "",
  title: "",
  link: "",
  imageUrl: "",
  isActive: true,
};

type FormState = typeof emptyForm;

const MAX_BANNER_WIDTH = 1536;
const MAX_BANNER_HEIGHT = 1545;
const MAX_BANNER_IMAGE_BYTES = 2_000_000;

const getImageSize = (dataUrl: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });

const AdminBanners = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useBanners();
  const [form, setForm] = useState<FormState>(emptyForm);

  const isEditing = Boolean(form.id);

  const handleSave = () => {
    if (!form.title.trim() || !form.imageUrl.trim()) return;
    const payload: Banner = {
      id: form.id || `BNR-${Date.now()}`,
      title: form.title.trim(),
      link: form.link.trim() || undefined,
      imageUrl: form.imageUrl.trim(),
      isActive: form.isActive,
      createdAt: form.id ? banners.find((b) => b.id === form.id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    if (isEditing) updateBanner(payload);
    else addBanner(payload);

    setForm(emptyForm);
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      id: banner.id,
      title: banner.title,
      link: banner.link || "",
      imageUrl: banner.imageUrl,
      isActive: banner.isActive,
    });
  };

  const handleDelete = (bannerId: string) => {
    if (confirm("Delete this banner?")) deleteBanner(bannerId);
  };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > MAX_BANNER_IMAGE_BYTES) {
      alert("Image is too large for local storage. Please use a smaller image or paste an image URL instead.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    const { width, height } = await getImageSize(dataUrl);
    if (width > MAX_BANNER_WIDTH || height > MAX_BANNER_HEIGHT) {
      alert(`Banner image is too large. Max allowed is ${MAX_BANNER_WIDTH}x${MAX_BANNER_HEIGHT}px.`);
      return;
    }
    setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
  };

  return (
    <AdminLayout>
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Vertical Ads</h2>
            <span className="text-xs text-ink-600">{banners.length} total</span>
          </div>
          <div className="mt-4 space-y-3">
            {banners.length === 0 && (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-6 text-sm text-ink-600">
                No ads yet. Add your first banner on the right.
              </div>
            )}
            {banners.map((banner) => (
              <div key={banner.id} className="flex flex-col gap-3 rounded-xl border border-emerald-100 bg-white p-4 md:flex-row md:items-center">
                <div className="h-28 w-24 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50 flex items-center justify-center">
                  <img src={banner.imageUrl} alt={banner.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink-900">{banner.title}</p>
                  <p className="text-xs text-ink-600">{banner.link || "No link"}</p>
                  <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs ${banner.isActive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-outline" onClick={() => handleEdit(banner)}>
                    Edit
                  </button>
                  <button type="button" className="btn-outline text-rose-600 border-rose-200" onClick={() => handleDelete(banner.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">{isEditing ? "Edit Banner" : "Add New Banner"}</h2>
          <p className="text-sm text-ink-700 mt-1">Used for the vertical ad area on the home page. Max size: 1536x1545px.</p>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input className="input" placeholder="Banner title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" placeholder="Click URL (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
            <div className="flex gap-2">
              <button type="button" className="btn-primary w-full" onClick={handleSave}>
                {isEditing ? "Update Banner" : "Save Banner"}
              </button>
              {isEditing && (
                <button type="button" className="btn-outline w-full" onClick={() => setForm(emptyForm)}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
