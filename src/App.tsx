import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductsPage from "./pages/products/page.tsx";
import ProductDetailPage from "./pages/products/[slug]/page.tsx";
import CartPage from "./pages/cart/page.tsx";
import CheckoutPage from "./pages/checkout/page.tsx";
import CheckoutSuccessPage from "./pages/checkout/success/page.tsx";
import CheckoutCancelPage from "./pages/checkout/cancel/page.tsx";
import OrdersPage from "./pages/orders/page.tsx";
import OrderDetailPage from "./pages/orders/[id]/page.tsx";
import ProfilePage from "./pages/profile/page.tsx";
import AdminDashboard from "./pages/admin/page.tsx";
import AdminProductsPage from "./pages/admin/products/page.tsx";
import AdminCategoriesPage from "./pages/admin/categories/page.tsx";
import AdminOrdersPage from "./pages/admin/orders/page.tsx";
import AdminShippingPage from "./pages/admin/shipping/page.tsx";
import AdminUsersPage from "./pages/admin/users/page.tsx";
import AdminSettingsPage from "./pages/admin/settings/page.tsx";
import AdminSiteConfigPage from "./pages/admin/site-config/page.tsx";
import AdminStripeConfigPage from "./pages/admin/stripe-config/page.tsx";
import AdminMediaPage from "./pages/admin/media/page.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/shipping" element={<AdminShippingPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/site-config" element={<AdminSiteConfigPage />} />
          <Route path="/admin/stripe-config" element={<AdminStripeConfigPage />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
