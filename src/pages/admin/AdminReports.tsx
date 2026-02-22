import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/format";
import { useOrders } from "@/context/OrderContext";

const AdminReports = () => {
  const { orders } = useOrders();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).getTime();

  const totals = orders.reduce(
    (acc, order) => {
      const total = order.total ?? order.totalAmount ?? 0;
      const created = new Date(order.createdAt).getTime();
      const isCancelled = order.status === "Cancelled";
      if (!isCancelled) acc.totalRevenue += total;
      acc.totalOrders += 1;
      if (!isCancelled && created >= startOfDay) acc.daily += total;
      if (!isCancelled && created >= startOfWeek) acc.weekly += total;
      if (!isCancelled && created >= startOfMonth) acc.monthly += total;
      return acc;
    },
    { daily: 0, weekly: 0, monthly: 0, totalRevenue: 0, totalOrders: 0 }
  );

  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Daily Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(totals.daily)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Weekly Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(totals.weekly)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Monthly Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(totals.monthly)}</p>
        </div>
      </div>
      <div className="card mt-8 p-6">
        <h2 className="text-lg font-semibold text-ink-900">Revenue Summary</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 text-sm text-ink-700">
          <div className="flex justify-between"><span>Total Revenue</span><span className="font-semibold text-ink-900">{formatCurrency(totals.totalRevenue)}</span></div>
          <div className="flex justify-between"><span>Total Orders</span><span className="font-semibold text-ink-900">{totals.totalOrders}</span></div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
