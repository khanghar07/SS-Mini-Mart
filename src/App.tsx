import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from "@/context/ProductContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { BannerProvider } from "@/context/BannerContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import TrackOrder from "@/pages/TrackOrder";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminReports from "@/pages/admin/AdminReports";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCategoryProducts from "@/pages/admin/AdminCategoryProducts";
import AdminBanners from "@/pages/admin/AdminBanners";
import NotFound from "@/pages/NotFound";

const App = () => (
  <CategoryProvider>
    <BannerProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/categories/:id" element={<AdminCategoryProducts />} />
                <Route path="/admin/banners" element={<AdminBanners />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </div>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </BannerProvider>
  </CategoryProvider>
);

export default App;
