import { Store, Phone, Mail, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-emerald-100 bg-white mt-16">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Store className="h-4 w-4" />
            </div>
            <span className="text-lg font-heading font-bold text-ink-900">SS Family Mart</span>
          </div>
          <p className="text-sm text-ink-700">
            Your neighborhood supermarket, quality products, great prices, delivered to your door.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-ink-900 mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-ink-700">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/track-order">Track Order</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-ink-900 mb-3">Contact Us</h4>
          <div className="flex flex-col gap-2 text-sm text-ink-700">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 03353531424</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> khanghar07@gmail.com</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dileep Nagar Mithi</div>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-100 py-4 text-center text-xs text-ink-700">
        <div>&copy; 2026 SS Family Mart. All rights reserved.</div>
        <div>Designed by GenXdevelopers.</div>
      </div>
    </footer>
  );
};

export default Footer;
