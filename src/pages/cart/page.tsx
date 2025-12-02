import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon, TrashIcon, ArrowLeftIcon } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function CartPage() {
  const cartItems = useQuery(api.cart.get, {});
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeItem = useMutation(api.cart.remove);
  const clearCart = useMutation(api.cart.clear);

  const subtotal = cartItems?.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0) || 0;

  const shippingInfo = useQuery(api.shipping.calculateShipping, {
    subtotal,
  });

  const handleUpdateQuantity = async (cartItemId: Id<"cart">, newQuantity: number) => {
    try {
      await updateQuantity({ cartItemId, quantity: newQuantity });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId: Id<"cart">) => {
    try {
      await removeItem({ cartItemId });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart({});
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold">My Cart</h1>
          </div>

          <Unauthenticated>
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Sign in to view your cart</h2>
              <p className="text-muted-foreground mb-8">You need to be signed in to shop with us.</p>
              <SignInButton />
            </div>
          </Unauthenticated>

          <Authenticated>
            {!cartItems ? (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
                <div>
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-8">You haven't added any items to your cart yet.</p>
                <Link to="/products">
                  <Button size="lg">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Cart Items ({cartItems.length})
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 bg-card rounded-lg border"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-24 relative overflow-hidden rounded-md bg-muted">
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
                        <Link to={`/products/${item.product.slug}`}>
                          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold mt-2">
                          ₺{item.product.price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item._id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemove(item._id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>

                        {item.quantity >= item.product.stock && (
                          <p className="text-xs text-destructive mt-2">
                            Maximum stock quantity reached
                          </p>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₺{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  <div className="bg-card rounded-lg border p-6 sticky top-24">
                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">€{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-muted-foreground">
                          {shippingInfo?.isFreeShipping ? "FREE" : "Calculated at checkout"}
                        </span>
                      </div>
                      
                      {/* Free Shipping Progress */}
                      {shippingInfo && shippingInfo.threshold > 0 && !shippingInfo.isFreeShipping && (
                        <div className="pt-2">
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">For free shipping</span>
                              <span className="font-medium text-primary">
                                €{shippingInfo.amountToFreeShipping.toFixed(2)} more
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, (subtotal / shippingInfo.threshold) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Free shipping on orders over €{shippingInfo.threshold.toFixed(2)}!
                          </p>
                        </div>
                      )}

                      {shippingInfo?.isFreeShipping && (
                        <div className="bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 px-3 py-2 rounded-md text-sm font-medium">
                          🎉 You've earned free shipping!
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link to="/checkout">
                      <Button size="lg" className="w-full">
                        Proceed to Checkout
                      </Button>
                    </Link>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <p>✓ Secure payment</p>
                      <p>✓ Fast delivery</p>
                      <p>✓ 14-day return guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Authenticated>
        </div>
      </div>

      <Footer />
    </div>
  );
}
