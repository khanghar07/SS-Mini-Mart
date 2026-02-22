import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/format";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";

const emptyForm = {
  id: "",
  name: "",
  price: "",
  categoryId: "",
  stock: "",
  imageUrl: "",
  discount: "",
  description: "",
};

type FormState = typeof emptyForm;
const MAX_PRODUCT_IMAGE_BYTES = 2_000_000;

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [form, setForm] = useState<FormState>({ ...emptyForm, categoryId: categories[0]?.id || "" });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter !== "all") list = list.filter((p) => p.categoryId === categoryFilter);
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [products, search, categoryFilter]);

  const isEditing = Boolean(form.id);

  const handleAddOrUpdate = () => {
    if (!form.name.trim() || !form.price.trim() || !form.stock.trim() || !form.imageUrl.trim()) return;

    const price = Number(form.price);
    const stock = Number(form.stock);
    const discount = Number(form.discount || 0);
    if (!Number.isFinite(price) || !Number.isFinite(stock) || !Number.isFinite(discount)) return;

    const payload: Product = {
      id: form.id || `P-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || "Fresh product added by admin.",
      price,
      discount,
      categoryId: form.categoryId.trim() || categories[0]?.id || "uncategorized",
      imageUrl: form.imageUrl.trim(),
      stock,
      isActive: true,
    };

    if (isEditing) updateProduct(payload);
    else addProduct(payload);

    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      categoryId: product.categoryId,
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      discount: String(product.discount ?? 0),
      description: product.description ?? "",
    });
  };

  const handleDelete = (productId: string) => {
    if (confirm("Delete this product?")) deleteProduct(productId);
  };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      alert("Image is too large. Please use a smaller image.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinary(file);
      setUploadProgress(100);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Failed to upload product image.", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <div className="card p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Product Catalog</h2>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="Search product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-ink-700">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-ink-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-emerald-100">
                    <td className="py-3">{p.name}</td>
                    <td>{categories.find((c) => c.id === p.categoryId)?.name || p.categoryId}</td>
                    <td>{formatCurrency(p.price)}</td>
                    <td>{p.stock}</td>
                    <td className="space-x-2">
                      <button className="btn-outline" type="button" onClick={() => handleEdit(p)}>
                        Edit
                      </button>
                      <button className="btn-outline text-rose-600 border-rose-200" type="button" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="add-product" className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">{isEditing ? "Edit Product" : "Add New Product"}</h2>
          <p className="text-sm text-ink-700 mt-1">Updates are synced across devices.</p>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Price (PKR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input className="input" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
            {uploading && (
              <div className="text-xs text-ink-700">Uploading image... {uploadProgress}%</div>
            )}
            <input className="input" placeholder="Discount % (optional)" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            <textarea className="input" placeholder="Description (optional)" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-2">
              <button type="button" className="btn-primary w-full" onClick={handleAddOrUpdate}>
                {isEditing ? "Update Product" : "Save Product"}
              </button>
              {isEditing && (
                <button type="button" className="btn-outline w-full" onClick={() => setForm({ ...emptyForm, categoryId: categories[0]?.id || "" })}>
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

export default AdminProducts;
