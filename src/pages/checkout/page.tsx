import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Loader2Icon, ShoppingBagIcon, LockIcon, CreditCardIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGuestSession } from "@/hooks/use-guest-session.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

interface CheckoutForm {
  email?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  shippingMethodId: Id<"shippingMethods">;
  notes?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = useGuestSession();
  const cartItems = useQuery(api.cart.get, sessionId ? { sessionId } : "skip");
  const shippingMethods = useQuery(api.shipping.getActiveMethods, {}) as Array<{
    _id: Id<"shippingMethods">;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    active: boolean;
    order: number;
  }> | undefined;
  const createOrder = useMutation(api.orders.create);
  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      country: "United States",
      email: user?.profile.email,
    },
  });

  const selectedShippingMethodId = watch("shippingMethodId");
  const selectedShippingMethod = shippingMethods?.find(
    (m: { _id: Id<"shippingMethods"> }) => m._id === selectedShippingMethodId,
  );

  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0) || 0;

  const shippingCost = selectedShippingMethod?.price || 0;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    if (!data.shippingMethodId) {
      toast.error("Please select a shipping method");
      return;
    }

    if (!user && !data.email) {
      toast.error("Email is required");
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createOrder({
        shippingMethodId: data.shippingMethodId,
        shippingAddress: {
          name: data.name,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        notes: data.notes,
        guestEmail: !user ? data.email : undefined,
        sessionId: sessionId,
      });

      const { url } = await createCheckout({ orderId });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create order",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <Link
              to="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Checkout
                </h1>
                {!user && (
                  <p className="text-muted-foreground">
                    Checking out as a guest
                  </p>
                )}
              </div>
              <div className="hidden md:flex items-center gap-3 bg-card px-6 py-3 rounded-full border border-border/50">
                <LockIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
            </div>
          </div>

          {!cartItems || !shippingMethods ? (
            <Skeleton className="h-96 w-full rounded-2xl" />
          ) : cartItems.length === 0 ? (
            <div className="text-center py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
                <ShoppingBagIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add items to your cart before checkout.
              </p>
              <Link to="/products">
                <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Guest Email */}
                  {!user && (
                    <div className="bg-card rounded-2xl p-8 border border-border/50">
                      <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                      <div>
                        <Label htmlFor="email" className="text-base mb-2">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          className="h-12 rounded-xl text-base"
                          {...register("email", {
                            required: !user ? "Email is required" : false,
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.email.message}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          We'll send your order confirmation here
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Shipping Address */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-base mb-2">Full Name</Label>
                        <Input
                          id="name"
                          className="h-12 rounded-xl text-base"
                          {...register("name", {
                            required: "Full name is required",
                          })}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="street" className="text-base mb-2">Street Address</Label>
                        <Input
                          id="street"
                          className="h-12 rounded-xl text-base"
                          {...register("street", {
                            required: "Street address is required",
                          })}
                          placeholder="123 Main Street"
                        />
                        {errors.street && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.street.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-base mb-2">City</Label>
                          <Input
                            id="city"
                            className="h-12 rounded-xl text-base"
                            {...register("city", {
                              required: "City is required",
                            })}
                            placeholder="New York"
                          />
                          {errors.city && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.city.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="state" className="text-base mb-2">State / Province</Label>
                          <Input
                            id="state"
                            className="h-12 rounded-xl text-base"
                            {...register("state", {
                              required: "State is required",
                            })}
                            placeholder="NY"
                          />
                          {errors.state && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode" className="text-base mb-2">ZIP / Postal Code</Label>
                          <Input
                            id="zipCode"
                            className="h-12 rounded-xl text-base"
                            {...register("zipCode", {
                              required: "ZIP code is required",
                            })}
                            placeholder="10001"
                          />
                          {errors.zipCode && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-base mb-2">Phone</Label>
                          <Input
                            id="phone"
                            className="h-12 rounded-xl text-base"
                            {...register("phone", {
                              required: "Phone is required",
                            })}
                            placeholder="+1 555 123 4567"
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country" className="text-base mb-2">Country</Label>
                        <Input
                          id="country"
                          className="h-12 rounded-xl text-base"
                          {...register("country", {
                            required: "Country is required",
                          })}
                          placeholder="United States"
                        />
                        {errors.country && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
                    <RadioGroup
                      value={selectedShippingMethodId}
                      onValueChange={(value) =>
                        setValue(
                          "shippingMethodId",
                          value as Id<"shippingMethods">,
                        )
                      }
                      className="space-y-3"
                    >
                      {shippingMethods.map((method) => (
                        <label
                          key={method._id}
                          htmlFor={method._id}
                          className="flex items-start gap-4 p-5 rounded-xl border border-border/50 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                        >
                          <RadioGroupItem
                            value={method._id}
                            id={method._id}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-semibold text-base">
                                {method.name}
                              </div>
                              <div className="font-bold text-lg">
                                {method.price === 0
                                  ? "FREE"
                                  : `€${method.price.toFixed(2)}`}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {method.description} • {method.estimatedDays}
                            </div>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                    {errors.shippingMethodId && (
                      <p className="text-sm text-destructive mt-3">
                        Please select a shipping method
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <h2 className="text-xl font-bold mb-6">Order Notes (Optional)</h2>
                    <Textarea
                      {...register("notes")}
                      className="min-h-[120px] rounded-xl resize-none text-base"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                    <div className="p-8">
                      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                      {/* Cart Items */}
                      <div className="space-y-4 mb-6 pb-6 border-b">
                        {cartItems.map((item) => (
                          <div key={item._id} className="flex gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {item.product.images[0] && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-sm font-semibold">
                              €{(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-muted-foreground">Shipping</span>
                          <span className="font-semibold">
                            {shippingCost === 0
                              ? <span className="text-green-600">FREE</span>
                              : `€${shippingCost.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-6 mb-6">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <span>€{total.toFixed(2)}</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full text-base py-6 shadow-lg hover:shadow-xl transition-all"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCardIcon className="mr-2 h-5 w-5" />
                            Complete Order
                          </>
                        )}
                      </Button>

                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <LockIcon className="h-4 w-4 text-green-600" />
                          <span>Secured by Stripe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
