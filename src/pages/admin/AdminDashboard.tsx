import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/format";
import { useOrders } from "@/context/OrderContext";
import { OrderStatus } from "@/types";
import { useHero } from "@/context/HeroContext";
import { useProducts } from "@/context/ProductContext";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  return startOfDay(date);
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const AdminDashboard = () => {
  const { orders } = useOrders();
  const { heroImage } = useHero();
  const { products } = useProducts();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const now = new Date();
  const dayStart = startOfDay(now).getTime();
  const weekStart = startOfWeek(now).getTime();
  const monthStart = startOfMonth(now).getTime();

  const isDelivered = (status: OrderStatus) => status === "Delivered";
  const isActive = (status: OrderStatus) => status !== "Delivered" && status !== "Cancelled";

  const activeOrders = orders.filter((o) => isActive(o.status));

  const deliveredToday = orders.filter(
    (o) => isDelivered(o.status) && new Date(o.createdAt).getTime() >= dayStart
  );

  const revenueToday = deliveredToday.reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

  const revenueWeek = orders
    .filter((o) => isDelivered(o.status) && new Date(o.createdAt).getTime() >= weekStart)
    .reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

  const revenueMonth = orders
    .filter((o) => isDelivered(o.status) && new Date(o.createdAt).getTime() >= monthStart)
    .reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

  const revenueTotal = orders
    .filter((o) => isDelivered(o.status))
    .reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

  const lowStock = products.filter((p) => p.stock <= 5);

  const handleHeroUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const downloadURL = await uploadToCloudinary(file);

      const existingSnap = await getDocs(query(collection(db, "hero"), orderBy("createdAt", "desc"), limit(1)));
      const existingDoc = existingSnap.docs[0];

      if (existingDoc) {
        await updateDoc(doc(db, "hero", existingDoc.id), {
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "hero"), {
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Failed to upload hero image.", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Hero Image</h2>
            <p className="text-sm text-ink-700">Upload the main homepage hero image.</p>
          </div>
          {heroImage && (
            <img src={heroImage} alt="Hero preview" className="h-16 w-24 rounded-lg object-cover border border-emerald-100" />
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="btn-primary" type="button" disabled={!file || uploading} onClick={handleHeroUpload}>
            {uploading ? "Uploading..." : "Upload Hero"}
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Active Orders</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{activeOrders.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Delivered Today</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{deliveredToday.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Revenue Today</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(revenueToday)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Revenue This Week</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(revenueWeek)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Revenue This Month</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(revenueMonth)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Total Revenue</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(revenueTotal)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">Low Stock Alerts</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            {lowStock.length === 0 && <li className="text-ink-600">No low stock items right now.</li>}
            {lowStock.map((item) => (
              <li key={item.id}>{item.name} - {item.stock} left</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">Revenue Summary</h2>
          <p className="mt-2 text-sm text-ink-700">All orders to date.</p>
          <div className="mt-4 max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-ink-700">
                <tr>
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-ink-700">
                {orders.length === 0 && (
                  <tr>
                    <td className="py-2 text-ink-600" colSpan={5}>No orders yet.</td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-emerald-100">
                    <td className="py-2">{order.orderId || order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{formatCurrency(order.total ?? order.totalAmount ?? 0)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
