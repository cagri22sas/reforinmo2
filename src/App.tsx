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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
