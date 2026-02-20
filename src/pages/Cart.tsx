import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="container py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-ink-700/50 mb-4" />
        <h1 className="text-2xl font-heading font-bold text-ink-900 mb-2">Your cart is empty</h1>
        <p className="text-ink-700 mb-6">Start adding some products!</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-heading font-bold text-ink-900 mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const price = item.product.discount > 0
              ? item.product.price * (1 - item.product.discount / 100)
              : item.product.price;
            return (
              <div key={item.product.id} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-soft">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="font-heading font-semibold text-ink-900 hover:text-brand-700 text-sm">
                    {item.product.name}
                  </Link>
                  <p className="text-sm font-bold text-ink-900 mt-1">{formatCurrency(price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-emerald-100 rounded-xl">
                      <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-rose-500" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-ink-900">{formatCurrency(price * item.quantity)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-6 h-fit sticky top-20 shadow-soft">
          <h3 className="font-heading font-bold text-ink-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-700">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-700">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="border-t border-emerald-100 pt-2 flex justify-between font-heading font-bold text-ink-900 text-base">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="block mt-4">
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
