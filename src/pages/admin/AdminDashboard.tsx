import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/format";
import { useOrders } from "@/context/OrderContext";
import { OrderStatus } from "@/types";

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

  const revenueToday = deliveredToday.reduce((sum, o) => sum + o.totalAmount, 0);

  const revenueWeek = orders
    .filter((o) => isDelivered(o.status) && new Date(o.createdAt).getTime() >= weekStart)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const revenueMonth = orders
    .filter((o) => isDelivered(o.status) && new Date(o.createdAt).getTime() >= monthStart)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const revenueTotal = orders
    .filter((o) => isDelivered(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <AdminLayout>
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
            <li>Jasmine Rice 5kg - 3 left</li>
            <li>Frozen Chicken Wings - 2 left</li>
            <li>Sunflower Oil 1L - 4 left</li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-ink-900">Revenue Summary</h2>
          <p className="mt-2 text-sm text-ink-700">Totals update automatically by date.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
