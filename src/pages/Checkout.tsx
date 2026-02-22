import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Checkout = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      return;
    }
    if (form.phone.trim().length !== 11) {
      alert("Phone number must be 11 digits.");
      return;
    }

    setLoading(true);
    const orderId = `ORD-${String(Date.now()).slice(-6)}`;
    const order = {
      id: orderId,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.discount > 0 ? i.product.price * (1 - i.product.discount / 100) : i.product.price,
      })),
      subtotal,
      deliveryFee,
      totalAmount: total,
      status: "Pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stockAdjusted: "none" as const,
    };

    try {
      await addDoc(collection(db, "orders"), {
        id: orderId,
        orderId,
        items: order.items,
        total: order.totalAmount,
        status: "Pending",
        paymentMethod: "Cash on Delivery",
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        notes: order.notes,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        totalAmount: order.totalAmount,
        stockAdjusted: order.stockAdjusted,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Failed to place order.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-6 max-w-2xl">
      <h1 className="text-2xl font-heading font-bold text-ink-900 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 space-y-4 shadow-soft">
          <h2 className="font-heading font-semibold text-ink-900">Delivery Information</h2>
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                setForm({ ...form, phone: digits });
              }}
              inputMode="numeric"
              maxLength={11}
              pattern="\d{11}"
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea id="address" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-soft">
          <h2 className="font-heading font-semibold text-ink-900 mb-3">Payment Method</h2>
          <div className="rounded-lg bg-emerald-50 p-3 text-sm text-ink-900 font-semibold">
            Cash on Delivery
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-soft">
          <h2 className="font-heading font-semibold text-ink-900 mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-ink-700">
                <span>{item.product.name} x {item.quantity}</span>
                <span>{formatCurrency((item.product.discount > 0 ? item.product.price * (1 - item.product.discount / 100) : item.product.price) * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-emerald-100 pt-2 space-y-1">
              <div className="flex justify-between text-ink-700"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-ink-700"><span>Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
              <div className="flex justify-between font-heading font-bold text-ink-900 text-base pt-1"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Placing Order..." : `Place Order - ${formatCurrency(total)}`}
        </Button>
      </form>
    </main>
  );
};

export default Checkout;
