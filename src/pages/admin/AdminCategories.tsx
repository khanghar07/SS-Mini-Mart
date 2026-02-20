import AdminLayout from "@/components/layout/AdminLayout";
import { useCategories } from "@/context/CategoryContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { fileToDataUrl } from "@/lib/file";
import type { Category } from "@/types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const emptyForm = {
  id: "",
  name: "",
  icon: "??",
  imageUrl: "",
};

type FormState = typeof emptyForm;

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [form, setForm] = useState<FormState>(emptyForm);

  const isEditing = Boolean(form.id);

  const handleAddOrUpdate = () => {
    if (!form.name.trim()) return;
    const base = slugify(form.name);
    let id = form.id || base || `cat-${Date.now()}`;
    if (!form.id && categories.some((c) => c.id === id)) {
      id = `${id}-${Date.now()}`;
    }

    const payload: Category = {
      id,
      name: form.name.trim(),
      icon: form.icon.trim() || "??",
      imageUrl:
        form.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop",
    };

    if (isEditing) updateCategory(payload);
    else addCategory(payload);

    setForm(emptyForm);
  };

  const handleEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      icon: category.icon,
      imageUrl: category.imageUrl,
    });
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Delete this category?")) deleteCategory(categoryId);
  };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
  };

  return (
    <AdminLayout>
      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">Categories</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.id} className="rounded-xl border border-emerald-100 bg-white overflow-hidden">
                <Link to={`/admin/categories/${c.id}`} className="block">
                  <div className="h-28 w-full">
                    <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-ink-700">{c.icon}</div>
                    <div className="font-semibold text-ink-900">{c.name}</div>
                    <div className="text-xs text-ink-700">{c.id}</div>
                  </div>
                </Link>
                <div className="flex gap-2 p-3 pt-0">
                  <button className="btn-outline w-full" type="button" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button className="btn-outline w-full text-rose-600 border-rose-200" type="button" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">{isEditing ? "Edit Category" : "Add New Category"}</h2>
          <p className="text-sm text-ink-700 mt-1">Images are uploaded locally and stored in browser.</p>
          <div className="mt-4 space-y-3">
            <input className="input" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Icon (emoji)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            <div className="flex gap-2">
              <button type="button" className="btn-primary w-full" onClick={handleAddOrUpdate}>
                {isEditing ? "Update Category" : "Add Category"}
              </button>
              {isEditing && (
                <button type="button" className="btn-outline w-full" onClick={() => setForm(emptyForm)}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
