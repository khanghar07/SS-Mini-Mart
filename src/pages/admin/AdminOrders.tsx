import AdminLayout from "@/components/layout/AdminLayout";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { formatCurrency } from "@/lib/format";
import { useMemo, useState } from "react";
import type { Order, OrderStatus, StockAdjusted } from "@/types";

const statusOptions: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const isFinal = (status: OrderStatus) => status === "Cancelled" || status === "Delivered";

const AdminOrders = () => {
  const { orders, updateOrderStatus, markStockAdjusted } = useOrders();
  const { adjustStock } = useProducts();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<Record<string, OrderStatus>>({});

  const { activeOrders, completedOrders, cancelledOrders } = useMemo(() => {
    const active = orders.filter((o) => !isFinal(o.status));
    const completed = orders.filter((o) => o.status === "Delivered");
    const cancelled = orders.filter((o) => o.status === "Cancelled");
    return { activeOrders: active, completedOrders: completed, cancelledOrders: cancelled };
  }, [orders]);

  const applyStatusAndStock = (order: Order) => {
    const nextStatus = pendingStatus[order.id] || order.status;
    if (isFinal(order.status)) return;

    if (nextStatus !== order.status) {
      updateOrderStatus(order.id, nextStatus);
    }

    const adjusted: StockAdjusted = order.stockAdjusted || "none";

    if ((nextStatus === "Accepted" || nextStatus === "Delivered") && adjusted !== "deducted") {
      adjustStock(order.items, "deduct");
      markStockAdjusted(order.id, "deducted");
    }

    if (nextStatus === "Cancelled" && adjusted === "deducted") {
      adjustStock(order.items, "restore");
      markStockAdjusted(order.id, "restored");
    }
  };

  const renderOrderTable = (list: Order[]) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase text-ink-700">
          <tr>
            <th className="pb-3">Order ID</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">Phone</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-ink-900">
          {list.map((o) => (
            <tr key={o.id} className="border-t border-emerald-100 align-top">
              <td className="py-3 font-semibold">{o.id}</td>
              <td className="py-3">{o.customerName}</td>
              <td className="py-3">{o.phone}</td>
              <td className="py-3">{formatCurrency(o.totalAmount)}</td>
              <td className="py-3">
                <select
                  className="input py-2"
                  value={pendingStatus[o.id] || o.status}
                  disabled={isFinal(o.status)}
                  onChange={(e) =>
                    setPendingStatus((prev) => ({ ...prev, [o.id]: e.target.value as OrderStatus }))
                  }
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="text-xs text-ink-700 mt-1">
                  Stock: {o.stockAdjusted || "none"}
                </div>
              </td>
              <td className="py-3 space-y-2">
                <button
                  className="btn-outline w-full"
                  type="button"
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                >
                  {expanded === o.id ? "Hide" : "View"}
                </button>
                <button
                  className="btn-primary w-full"
                  type="button"
                  disabled={isFinal(o.status)}
                  onClick={() => applyStatusAndStock(o)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrderDetails = () => {
    if (!expanded) return null;
    const order = orders.find((o) => o.id === expanded);
    if (!order) return null;

    const totalQuantity = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          <div><span className="text-ink-700">Customer:</span> <span className="font-semibold">{order.customerName}</span></div>
          <div><span className="text-ink-700">Phone:</span> <span className="font-semibold">{order.phone}</span></div>
          <div className="md:col-span-2"><span className="text-ink-700">Address:</span> <span className="font-semibold">{order.address}</span></div>
          {order.notes && (
            <div className="md:col-span-2"><span className="text-ink-700">Notes:</span> <span className="font-semibold">{order.notes}</span></div>
          )}
        </div>
        <div className="border-t border-emerald-100 pt-3 mt-3 text-sm">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-ink-900">
              <span>{item.name} x {item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-ink-700">
            <span>Total Quantity</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Active Orders</h2>
          <p className="text-sm text-ink-700">{activeOrders.length} total</p>
        </div>
        {renderOrderTable(activeOrders)}
        {renderOrderDetails()}
      </div>

      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Completed Orders</h2>
          <p className="text-sm text-ink-700">{completedOrders.length} total</p>
        </div>
        {renderOrderTable(completedOrders)}
      </div>

      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Cancelled Orders</h2>
          <p className="text-sm text-ink-700">{cancelledOrders.length} total</p>
        </div>
        {renderOrderTable(cancelledOrders)}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
