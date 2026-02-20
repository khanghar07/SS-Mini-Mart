import { useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, Search } from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/format";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-amber-400 text-white",
  Accepted: "bg-brand-600 text-white",
  Preparing: "bg-brand-600 text-white",
  "Out for Delivery": "bg-indigo-500 text-white",
  Delivered: "bg-emerald-600 text-white",
  Cancelled: "bg-rose-500 text-white",
};

const statusSteps: OrderStatus[] = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"];

const TrackOrder = () => {
  const { getOrderByIdAndPhone } = useOrders();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = getOrderByIdAndPhone(orderId.trim(), phone.trim());
    if (found) {
      setOrder(found);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <main className="container py-6 max-w-lg">
      <h1 className="text-2xl font-heading font-bold text-ink-900 mb-6 text-center">Track Your Order</h1>

      <form onSubmit={handleSearch} className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-4 mb-6 shadow-soft">
        <div>
          <Label htmlFor="orderId">Order ID</Label>
          <Input id="orderId" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="ORD-123456" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-0100" required />
        </div>
        <Button type="submit" className="w-full gap-2"><Search className="h-4 w-4" /> Track Order</Button>
      </form>

      {notFound && (
        <div className="text-center text-ink-700 py-8">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No order found. Please check your Order ID and phone number.</p>
        </div>
      )}

      {order && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-ink-900">{order.id}</h2>
            <Badge className={statusColors[order.status]}>{order.status}</Badge>
          </div>

          {order.status !== "Cancelled" && (
            <div className="flex items-center gap-1 mb-6 overflow-x-auto">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${i <= currentStep ? "bg-brand-600" : "bg-emerald-100"}`} />
                  {i < statusSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-brand-600" : "bg-emerald-100"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-700">Customer</span><span className="text-ink-900">{order.customerName}</span></div>
            <div className="flex justify-between"><span className="text-ink-700">Address</span><span className="text-ink-900 text-right max-w-[60%]">{order.address}</span></div>
            <div className="border-t border-emerald-100 pt-2 mt-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-ink-700">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-emerald-100 pt-2 flex justify-between font-heading font-bold text-ink-900">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TrackOrder;
