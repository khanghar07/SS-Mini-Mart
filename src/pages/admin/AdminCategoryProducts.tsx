import AdminLayout from "@/components/layout/AdminLayout";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { fileToDataUrl } from "@/lib/file";

const emptyForm = {
  id: "",
  name: "",
  price: "",
  stock: "",
  imageUrl: "",
  discount: "",
  description: "",
};

type FormState = typeof emptyForm;
const MAX_PRODUCT_IMAGE_BYTES = 2_000_000;

const AdminCategoryProducts = () => {
  const { id } = useParams();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);

  const category = categories.find((c) => c.id === id);

  const filtered = useMemo(() => {
    return products.filter((p) => p.category === id && p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, id, search]);

  const isEditing = Boolean(form.id);

  const handleAddOrUpdate = () => {
    if (!id || !form.name.trim() || !form.price.trim() || !form.stock.trim()) return;

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
      category: id,
      imageUrl:
        form.imageUrl.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop",
      stock,
      isActive: true,
    };

    if (isEditing) updateProduct(payload);
    else addProduct(payload);

    setForm(emptyForm);
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
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
      alert("Image is too large for local storage. Please use a smaller image or paste an image URL instead.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
  };

  return (
    <AdminLayout>
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-ink-900">
          {category ? `${category.icon} ${category.name}` : "Category"}
        </h2>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            className="input"
            placeholder="Search products in this category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-ink-700">
              <tr>
                <th className="pb-3">Product</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-ink-700">
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-emerald-100">
                  <td className="py-3">{p.name}</td>
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

      <div className="card p-6 mt-6">
        <h2 className="text-lg font-semibold text-ink-900">{isEditing ? "Edit Product" : "Add Product"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Price (PKR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input className="input" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
          <input className="input md:col-span-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
          <textarea className="input md:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn-primary w-full" type="button" onClick={handleAddOrUpdate}>
            {isEditing ? "Update Product" : "Save Product"}
          </button>
          {isEditing && (
            <button className="btn-outline w-full" type="button" onClick={() => setForm(emptyForm)}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoryProducts;
