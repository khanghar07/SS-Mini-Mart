import { useParams, Link } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId || o.orderId === orderId);

  if (!order) {
    return (
      <main className="container py-16 text-center">
        <p className="text-ink-700">Order not found</p>
      </main>
    );
  }

  return (
    <main className="container py-10 max-w-lg text-center">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-soft">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-brand-600" />
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold text-ink-900 mb-2">Order Placed!</h1>
        <p className="text-ink-700 mb-6">Thank you for your order. We'll start preparing it right away.</p>

        <div className="rounded-lg bg-emerald-50 p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-700">Order ID</span>
            <span className="font-heading font-bold text-ink-900">{order.orderId || order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-700">Total</span>
            <span className="font-heading font-bold text-ink-900">{formatCurrency(order.total ?? order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-700">Status</span>
            <span className="font-semibold text-brand-600">{order.status}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-700">Payment</span>
            <span className="font-medium text-ink-900">{order.paymentMethod ?? "Cash on Delivery"}</span>
          </div>
        </div>

        <p className="text-xs text-ink-700 mb-4">
          Save your Order ID and phone number to track your order.
        </p>

        <div className="flex flex-col gap-2">
          <Link to="/track-order">
            <Button className="w-full gap-2"><Package className="h-4 w-4" /> Track Order</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
