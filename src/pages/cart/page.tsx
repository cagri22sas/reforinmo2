import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon, XIcon, ArrowLeftIcon, ShoppingBagIcon, TruckIcon } from "lucide-react";
import { toast } from "sonner";
import { useGuestSession } from "@/hooks/use-guest-session.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useLanguage, translations } from "@/hooks/use-language.ts";

export default function CartPage() {
  const { user } = useAuth();
  const sessionId = useGuestSession();
  const cartItems = useQuery(api.cart.get, sessionId ? { sessionId } : "skip");
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeItem = useMutation(api.cart.remove);
  const clearCart = useMutation(api.cart.clear);
  const { language } = useLanguage();
  const t = translations[language];

  const subtotal = cartItems?.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const shippingInfo = useQuery(api.shipping.calculateShipping, {
    subtotal,
  });

  const handleUpdateQuantity = async (cartItemId: Id<"cart">, newQuantity: number) => {
    try {
      await updateQuantity({ cartItemId, quantity: newQuantity, sessionId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.errorOccurred);
    }
  };

  const handleRemove = async (cartItemId: Id<"cart">) => {
    try {
      await removeItem({ cartItemId, sessionId });
      toast.success(t.remove);
    } catch (error) {
      toast.error(t.errorOccurred);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart({ sessionId });
      toast.success(t.success);
    } catch (error) {
      toast.error(t.errorOccurred);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <Link 
              to="/products" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-6 group"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t.continueShopping}
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t.shoppingCart}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {cartItems?.length ? `${cartItems.length} ${cartItems.length === 1 ? language === 'en' ? 'item' : 'artículo' : language === 'en' ? 'items' : 'artículos'}` : t.cartEmpty}
                </p>
              </div>
            </div>
          </div>

          {!cartItems ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
              </div>
              <div>
                <Skeleton className="h-96 w-full rounded-2xl" />
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
                <ShoppingBagIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{t.cartEmpty}</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t.cartEmptyDesc}
              </p>
              <Link to="/products">
                <Button size="lg" className="rounded-full px-8">
                  {t.startShopping}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="group relative bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex gap-4 sm:gap-6 p-4 sm:p-6">
                      {/* Product Image */}
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-20 h-20 sm:w-28 sm:h-28 relative overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50 group-hover:scale-105 transition-transform duration-300">
                          {item.product.images[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <Link to={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 hover:text-primary transition-colors pr-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="ml-2 p-1.5 sm:p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          >
                            <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0 mt-4 sm:mt-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm text-muted-foreground">{language === 'en' ? 'Qty:' : 'Cant:'}</span>
                            <div className="flex items-center rounded-full border border-border/50 bg-muted/30">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-background"
                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-background"
                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-left sm:text-right">
                            <p className="text-xl sm:text-2xl font-bold">
                              €{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                €{item.product.price.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>

                        {item.quantity >= item.product.stock && (
                          <p className="text-xs text-orange-500 mt-3 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-orange-500" />
                            {language === 'en' ? 'Maximum available quantity' : 'Cantidad máxima disponible'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">{t.orderSummary}</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">{t.subtotal}</span>
                        <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">{language === 'en' ? 'Shipping' : 'Envío'}</span>
                        <span className="text-muted-foreground">
                          {shippingInfo?.isFreeShipping ? (
                            <span className="text-green-600 font-semibold">{language === 'en' ? 'FREE' : 'GRATIS'}</span>
                          ) : (
                            language === 'en' ? 'Calculated at checkout' : 'Calculado al pagar'
                          )}
                        </span>
                      </div>
                      
                      {/* Free Shipping Progress */}
                      {shippingInfo && shippingInfo.threshold > 0 && !shippingInfo.isFreeShipping && (
                        <div className="pt-4 pb-2">
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">
                                <TruckIcon className="h-4 w-4 inline mr-1" />
                                {t.freeShipping}
                              </span>
                              <span className="font-semibold text-primary">
                                €{shippingInfo.amountToFreeShipping.toFixed(2)} {language === 'en' ? 'away' : 'más'}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (subtotal / shippingInfo.threshold) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {shippingInfo?.isFreeShipping && (
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                          <TruckIcon className="h-4 w-4" />
                          {language === 'en' ? "You've earned free shipping!" : '¡Has ganado envío gratis!'}
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-6 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>{t.total}</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link to="/checkout" className="block">
                      <Button size="lg" className="w-full rounded-full text-base py-6 shadow-lg hover:shadow-xl transition-all">
                        {t.proceedToCheckout}
                      </Button>
                    </Link>

                    <div className="mt-6 pt-6 border-t space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>{t.secureCheckout}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{t.fastDelivery}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{language === 'en' ? 'Easy returns' : 'Devoluciones fáciles'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
