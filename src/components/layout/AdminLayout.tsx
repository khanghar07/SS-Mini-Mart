import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LayoutDashboard, Package, ClipboardList, BarChart3, LogOut, Store, Tags, Image as ImageIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/AdminAuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Categories", icon: Tags, path: "/admin/categories" },
  { label: "Ads", icon: ImageIcon, path: "/admin/banners" },
  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
  { label: "Account", icon: User, path: "/admin/account" }
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, logout } = useAdminAuth();

  useEffect(() => {
    if (!isAdmin) navigate("/admin-login");
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-ink-900">
      <div className="flex">
        <aside className="hidden md:flex w-64 flex-col border-r border-emerald-100 bg-white text-ink-900">
          <div className="flex items-center gap-2 px-4 h-16 border-b border-emerald-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Store className="h-4 w-4" />
            </div>
            <span className="font-heading font-bold text-ink-900">SS Family Mart Admin</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={active ? "outline" : "ghost"}
                    className={`w-full justify-start gap-2 ${active ? "font-semibold" : "text-ink-900"}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-emerald-100">
            <Button variant="ghost" className="w-full justify-start gap-2 text-ink-900" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-2 text-ink-900 mt-1">
                <Store className="h-4 w-4" /> View Store
              </Button>
            </Link>
          </div>
        </aside>

        <div className="flex-1">
          <header className="h-16 border-b border-emerald-100 bg-white flex items-center justify-between px-4 md:px-6">
            <h2 className="font-heading font-bold text-ink-900">
              {navItems.find((n) => location.pathname === n.path || location.pathname.startsWith(n.path + "/"))?.label || "Admin"}
            </h2>
            <Button variant="ghost" className="md:hidden" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
