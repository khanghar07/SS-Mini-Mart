import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-night-900/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-xl font-heading font-bold text-ink-900">SS Family Mart</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-ink-700">
          <Link to="/" className="hover:text-brand-700">Home</Link>
          <Link to="/products" className="hover:text-brand-700">Products</Link>
          <Link to="/track-order" className="hover:text-brand-700">Track Order</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/products">
            <Button variant="ghost" size="sm" className="text-ink-700">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="sm" className="text-ink-700">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-brand-600 text-white">
                {totalItems}
              </Badge>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-ink-700"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-night-900">
          <nav className="container flex flex-col gap-2 py-3 text-sm font-semibold">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-night-800">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-night-800">Products</Link>
            <Link to="/track-order" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-night-800">Track Order</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
