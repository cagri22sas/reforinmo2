import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import LiveChatWidget from "./components/LiveChatWidget.tsx";
import { lazy, Suspense } from "react";
import { Skeleton } from "./components/ui/skeleton.tsx";

// Eager load critical routes
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// Lazy load large pages
const ProductsPage = lazy(() => import("./pages/products/page.tsx"));
const ProductDetailPage = lazy(() => import("./pages/products/[slug]/page.tsx"));
const CartPage = lazy(() => import("./pages/cart/page.tsx"));
const CheckoutPage = lazy(() => import("./pages/checkout/page.tsx"));
const CheckoutSuccessPage = lazy(() => import("./pages/checkout/success/page.tsx"));
const CheckoutCancelPage = lazy(() => import("./pages/checkout/cancel/page.tsx"));
const OrdersPage = lazy(() => import("./pages/orders/page.tsx"));
const OrderDetailPage = lazy(() => import("./pages/orders/[id]/page.tsx"));
const OrderTrackingPage = lazy(() => import("./pages/orders/track/page.tsx"));
const ProfilePage = lazy(() => import("./pages/profile/page.tsx"));
const WishlistPage = lazy(() => import("./pages/wishlist/page.tsx"));

// Lazy load footer pages
const AboutPage = lazy(() => import("./pages/about/page.tsx"));
const ContactPage = lazy(() => import("./pages/contact/page.tsx"));
const StoresPage = lazy(() => import("./pages/stores/page.tsx"));
const ShippingPage = lazy(() => import("./pages/shipping/page.tsx"));
const ReturnsPage = lazy(() => import("./pages/returns/page.tsx"));
const FAQPage = lazy(() => import("./pages/faq/page.tsx"));
const PrivacyPage = lazy(() => import("./pages/privacy/page.tsx"));
const TermsPage = lazy(() => import("./pages/terms/page.tsx"));
const ImprintPage = lazy(() => import("./pages/imprint/page.tsx"));
const WarrantyPage = lazy(() => import("./pages/warranty/page.tsx"));

// Lazy load all admin pages
const AdminDashboard = lazy(() => import("./pages/admin/page.tsx"));
const AdminProductsPage = lazy(() => import("./pages/admin/products/page.tsx"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/categories/page.tsx"));
const AdminOrdersPage = lazy(() => import("./pages/admin/orders/page.tsx"));
const AdminShippingPage = lazy(() => import("./pages/admin/shipping/page.tsx"));
const AdminUsersPage = lazy(() => import("./pages/admin/users/page.tsx"));
const AdminSettingsPage = lazy(() => import("./pages/admin/settings/page.tsx"));
const AdminSiteConfigPage = lazy(() => import("./pages/admin/site-config/page.tsx"));
const AdminStripeConfigPage = lazy(() => import("./pages/admin/stripe-config/page.tsx"));
const AdminStripeDashboardPage = lazy(() => import("./pages/admin/stripe-dashboard/page.tsx"));
const AdminMediaPage = lazy(() => import("./pages/admin/media/page.tsx"));
const AdminSEOPage = lazy(() => import("./pages/admin/seo/page.tsx"));
const AdminChatPage = lazy(() => import("./pages/admin/chat/page.tsx"));
const AdminCouponsPage = lazy(() => import("./pages/admin/coupons/page.tsx"));
const AdminPagesPage = lazy(() => import("./pages/admin/pages/page.tsx"));
const AdminBrandsPage = lazy(() => import("./pages/admin/brands/page.tsx"));
const AdminUpdateImagesPage = lazy(() => import("./pages/admin/update-images.tsx"));
const AdminReviewsPage = lazy(() => import("./pages/admin/reviews/page.tsx"));
const AdminRemoveYachtbeachPage = lazy(() => import("./pages/admin/remove-yachtbeach/page.tsx"));
const AdminMigrateImagesPage = lazy(() => import("./pages/admin/migrate-images/page.tsx"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-4xl px-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/orders/track" element={<OrderTrackingPage />} />
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
            <Route path="/admin/brands" element={<AdminBrandsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/update-images" element={<AdminUpdateImagesPage />} />
            <Route path="/admin/remove-yachtbeach" element={<AdminRemoveYachtbeachPage />} />
            <Route path="/admin/migrate-images" element={<AdminMigrateImagesPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <LiveChatWidget />
      </BrowserRouter>
    </DefaultProviders>
  );
}
