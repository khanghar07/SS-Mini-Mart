import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from "@/context/ProductContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { BannerProvider } from "@/context/BannerContext";
import { HeroProvider } from "@/context/HeroContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedAdminRoute from "@/components/auth/ProtectedAdminRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartNotification from "@/components/cart/CartNotification";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import TrackOrder from "@/pages/TrackOrder";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminReports from "@/pages/admin/AdminReports";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCategoryProducts from "@/pages/admin/AdminCategoryProducts";
import AdminBanners from "@/pages/admin/AdminBanners";
import AdminAccount from "@/pages/admin/AdminAccount";
import NotFound from "@/pages/NotFound";

const App = () => (
  <AdminAuthProvider>
    <CategoryProvider>
      <BannerProvider>
        <HeroProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <CartNotification />
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedAdminRoute>
                        <AdminProducts />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedAdminRoute>
                        <AdminOrders />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedAdminRoute>
                        <AdminReports />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCategories />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories/:id"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCategoryProducts />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/banners"
                    element={
                      <ProtectedAdminRoute>
                        <AdminBanners />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/account"
                    element={
                      <ProtectedAdminRoute>
                        <AdminAccount />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Footer />
                </div>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </HeroProvider>
      </BannerProvider>
    </CategoryProvider>
  </AdminAuthProvider>
);

export default App;
