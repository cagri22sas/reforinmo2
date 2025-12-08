import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Loader2Icon, ShoppingBagIcon, LockIcon, CreditCardIcon, TagIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGuestSession } from "@/hooks/use-guest-session.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import { ConvexError } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", 
  "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", 
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", 
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", 
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", 
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", 
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", 
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", 
  "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
  "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", 
  "Zambia", "Zimbabwe"
];

// Load Stripe
const stripePromise = loadStripe("pk_live_51RtmYD5qD0qJf1JEgPyUBClL4RQm0y62QSmgIwS6LjHXYSgg93Z2MVns2HhvNkHKrSkFNLvy1uP5wn4PJ7X3EvTN00lZksu83z");

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

function CheckoutForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = useGuestSession();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    _id: Id<"coupons">;
    type: "percentage" | "fixed";
    value: number;
    description?: string;
    discountAmount: number;
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const cartItems = useQuery(api.cart.get, sessionId ? { sessionId } : "skip");
  const shippingMethods = useQuery(api.shipping.getActiveMethods, {});
  const createOrder = useMutation(api.orders.create);
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const confirmPayment = useAction(api.stripe.confirmPayment);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const selectedShippingMethodId = watch("shippingMethodId");
  const selectedCountry = watch("country");
  const selectedShippingMethod = shippingMethods?.find(
    (m) => m._id === selectedShippingMethodId,
  );

  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0) || 0;

  const shippingCost = selectedShippingMethod?.price || 0;
  const discount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const result = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.toUpperCase(), orderAmount: subtotal }),
      }).then(r => r.json());
      
      if (result && result.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          _id: result.coupon._id,
          type: result.coupon.type,
          value: result.coupon.value,
          description: result.coupon.description,
          discountAmount: result.discountAmount,
        });
        toast.success("Coupon applied successfully!");
        setCouponCode("");
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Invalid coupon code");
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!data.shippingMethodId) {
      toast.error("Please select a shipping method");
      return;
    }

    if (!user && !data.email) {
      toast.error("Email is required");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order
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
        couponCode: appliedCoupon?.code,
        discount: appliedCoupon?.discountAmount,
        couponId: appliedCoupon?._id,
      });

      // Step 2: Create payment intent
      const { clientSecret } = await createPaymentIntent({ orderId });

      // Step 3: Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.name,
            email: user?.profile.email || data.email,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Step 4: Confirm payment in our backend
        await confirmPayment({ orderId });
        
        // Navigate to success page - use replace to prevent back navigation
        navigate("/checkout/success", { replace: true });
      } else {
        throw new Error("Payment was not successful");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process payment",
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
          <div className="mb-8 sm:mb-12">
            <Link
              to="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 sm:mb-6 transition-colors group"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Checkout
                </h1>
                {!user && (
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Checking out as a guest
                  </p>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-card px-6 py-3 rounded-full border border-border/50">
                <LockIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
            </div>
          </div>

          {!cartItems || !shippingMethods ? (
            <Skeleton className="h-96 w-full rounded-2xl" />
          ) : cartItems.length === 0 && !isProcessing ? (
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
          ) : cartItems.length > 0 || isProcessing ? (
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
                        />
                        {errors.street && (
                          <p className="text-sm text-destructive mt-2">
                            {errors.street.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-base mb-2">City</Label>
                          <Input
                            id="city"
                            className="h-12 rounded-xl text-base"
                            {...register("city", {
                              required: "City is required",
                            })}
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
                          />
                          {errors.state && (
                            <p className="text-sm text-destructive mt-2">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode" className="text-base mb-2">ZIP / Postal Code</Label>
                          <Input
                            id="zipCode"
                            className="h-12 rounded-xl text-base"
                            {...register("zipCode", {
                              required: "ZIP code is required",
                            })}
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
                            type="tel"
                            className="h-12 rounded-xl text-base"
                            placeholder="+34 661 171 490"
                            {...register("phone", {
                              required: "Phone is required",
                              pattern: {
                                value: /^[\d\s\-+()]+$/,
                                message: "Please enter a valid phone number",
                              },
                              minLength: {
                                value: 8,
                                message: "Phone number must be at least 8 digits",
                              },
                            })}
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
                        <Select
                          value={selectedCountry}
                          onValueChange={(value) => setValue("country", value)}
                        >
                          <SelectTrigger className="h-12 rounded-xl text-base">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.country && (
                          <p className="text-sm text-destructive mt-2">
                            Please select a country
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

                  {/* Payment Information */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "hsl(var(--foreground))",
                              "::placeholder": {
                                color: "hsl(var(--muted-foreground))",
                              },
                            },
                            invalid: {
                              color: "hsl(var(--destructive))",
                            },
                          },
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                      <LockIcon className="h-3 w-3" />
                      Your payment information is encrypted and secure
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="bg-card rounded-2xl p-8 border border-border/50">
                    <h2 className="text-xl font-bold mb-6">Order Notes (Optional)</h2>
                    <Textarea
                      {...register("notes")}
                      className="min-h-[120px] rounded-xl resize-none text-base"
                      placeholder="Any special instructions for your order?"
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

                      {/* Coupon Code */}
                      <div className="mb-6 pb-6 border-b">
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-3">
                              <TagIcon className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-semibold text-green-900 dark:text-green-100">
                                  {appliedCoupon.code}
                                </p>
                                {appliedCoupon.description && (
                                  <p className="text-sm text-green-700 dark:text-green-300">
                                    {appliedCoupon.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              className="text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="coupon" className="text-base">
                              Coupon Code
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="coupon"
                                value={couponCode}
                                onChange={(e) =>
                                  setCouponCode(e.target.value.toUpperCase())
                                }
                                placeholder="Enter code"
                                className="h-12 rounded-xl text-base uppercase"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponCode.trim()}
                                className="px-6 h-12 rounded-xl"
                              >
                                {isApplyingCoupon ? (
                                  <Loader2Icon className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Apply"
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
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
                        {discount > 0 && (
                          <div className="flex justify-between text-base">
                            <span className="text-muted-foreground">Discount</span>
                            <span className="font-semibold text-green-600">
                              -€{discount.toFixed(2)}
                            </span>
                          </div>
                        )}
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
                        disabled={isProcessing || !stripe || !elements}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCardIcon className="mr-2 h-5 w-5" />
                            Pay €{total.toFixed(2)}
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
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
