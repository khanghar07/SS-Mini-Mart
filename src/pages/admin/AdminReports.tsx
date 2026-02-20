import AdminLayout from "@/components/layout/AdminLayout";
import { formatCurrency } from "@/lib/format";

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Daily Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(64250)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Weekly Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(482030)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-ink-700">Monthly Sales</p>
          <p className="text-2xl font-bold text-ink-900 mt-2">{formatCurrency(1843010)}</p>
        </div>
      </div>
      <div className="card mt-8 p-6">
        <h2 className="text-lg font-semibold text-ink-900">Revenue Summary</h2>
        <p className="mt-2 text-sm text-ink-700">Hook this section to analytics or reporting backend.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
