import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import LiveChatWidget from "./components/LiveChatWidget.tsx";
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
import AboutPage from "./pages/about/page.tsx";
import ContactPage from "./pages/contact/page.tsx";
import ShippingPage from "./pages/shipping/page.tsx";
import ReturnsPage from "./pages/returns/page.tsx";
import FAQPage from "./pages/faq/page.tsx";
import PrivacyPage from "./pages/privacy/page.tsx";
import TermsPage from "./pages/terms/page.tsx";
import ImprintPage from "./pages/imprint/page.tsx";
import WarrantyPage from "./pages/warranty/page.tsx";
import AdminDashboard from "./pages/admin/page.tsx";
import AdminProductsPage from "./pages/admin/products/page.tsx";
import AdminCategoriesPage from "./pages/admin/categories/page.tsx";
import AdminOrdersPage from "./pages/admin/orders/page.tsx";
import AdminShippingPage from "./pages/admin/shipping/page.tsx";
import AdminUsersPage from "./pages/admin/users/page.tsx";
import AdminSettingsPage from "./pages/admin/settings/page.tsx";
import AdminSiteConfigPage from "./pages/admin/site-config/page.tsx";
import AdminStripeConfigPage from "./pages/admin/stripe-config/page.tsx";
import AdminStripeDashboardPage from "./pages/admin/stripe-dashboard/page.tsx";
import AdminMediaPage from "./pages/admin/media/page.tsx";
import AdminSEOPage from "./pages/admin/seo/page.tsx";
import AdminChatPage from "./pages/admin/chat/page.tsx";
import AdminCouponsPage from "./pages/admin/coupons/page.tsx";
import AdminPagesPage from "./pages/admin/pages/page.tsx";
import AdminUpdateImagesPage from "./pages/admin/update-images.tsx";
import WishlistPage from "./pages/wishlist/page.tsx";
import StoresPage from "./pages/stores/page.tsx";

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
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/shipping" element={<AdminShippingPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/site-config" element={<AdminSiteConfigPage />} />
          <Route path="/admin/stripe-config" element={<AdminStripeConfigPage />} />
          <Route path="/admin/stripe-dashboard" element={<AdminStripeDashboardPage />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          <Route path="/admin/seo" element={<AdminSEOPage />} />
          <Route path="/admin/chat" element={<AdminChatPage />} />
          <Route path="/admin/coupons" element={<AdminCouponsPage />} />
          <Route path="/admin/pages" element={<AdminPagesPage />} />
          <Route path="/admin/update-images" element={<AdminUpdateImagesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <LiveChatWidget />
      </BrowserRouter>
    </DefaultProviders>
  );
}
