import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { SearchIcon, PackageIcon, TruckIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { motion } from "motion/react";
import { useTranslation } from "@/hooks/use-language.ts";
import { ConvexError } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

interface TrackingForm {
  orderNumber: string;
  email: string;
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  _id: Id<"orderItems">;
  _creationTime: number;
  orderId: Id<"orders">;
  productId: Id<"products">;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface ShippingMethod {
  _id: Id<"shippingMethods">;
  _creationTime: number;
  name: string;
  price: number;
  estimatedDays: string;
  active: boolean;
}

interface Order {
  _id: Id<"orders">;
  _creationTime: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount?: number;
  couponCode?: string;
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  shippingMethod: ShippingMethod | null;
}

export default function OrderTrackingPage() {
  const { t } = useTranslation();
  const [trackingInfo, setTrackingInfo] = useState<{ orderNumber: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackingForm>();

  const order = useQuery(
    api.orders.trackOrder,
    trackingInfo ? trackingInfo : "skip"
  ) as Order | undefined;

  const onSubmit = (data: TrackingForm) => {
    setError(null);
    setTrackingInfo({
      orderNumber: data.orderNumber.trim().toUpperCase(),
      email: data.email.trim().toLowerCase(),
    });
  };

  const statusSteps = [
    { key: "pending", label: t("orderPending"), icon: ClockIcon },
    { key: "processing", label: t("processing"), icon: PackageIcon },
    { key: "shipped", label: t("shipped"), icon: TruckIcon },
    { key: "delivered", label: t("delivered"), icon: CheckCircle2Icon },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    const index = statusSteps.findIndex((step) => step.key === status);
    return index === -1 ? 0 : index;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <SEO title={t("orderTrackingTitle")} description={t("trackYourOrder")} />
      <Header />

      <div className="flex-1 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl"
          >
            <SearchIcon className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("orderTrackingTitle")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("trackYourOrder")}</p>
        </div>

        {/* Tracking Form */}
        {!order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{t("enterTrackingInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="orderNumber">{t("orderNumber")} *</Label>
                    <Input
                      id="orderNumber"
                      {...register("orderNumber", {
                        required: t("required"),
                      })}
                      className="mt-1.5"
                    />
                    {errors.orderNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.orderNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">{t("emailAddress")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: t("required"),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t("invalidEmail"),
                        },
                      })}
                      className="mt-1.5"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <SearchIcon className="w-4 h-4 mr-2" />
                    {t("trackOrder")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Status Tracker */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("orderStatus")}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTrackingInfo(null);
                      setError(null);
                    }}
                  >
                    {t("trackAnother")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("orderNumber")}:</span>
                    <span className="font-mono font-semibold">{order.orderNumber}</span>
                  </div>

                  {/* Progress Stepper */}
                  <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                      style={{
                        width: `${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                    <div className="relative flex justify-between">
                      {statusSteps.map((step, index) => {
                        const isActive = index <= getStatusIndex(order.status);
                        const Icon = step.icon;
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </motion.div>
                            <span
                              className={`mt-2 text-xs text-center max-w-[80px] ${
                                isActive ? "text-foreground font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("shippingAddress")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("orderDate")}:</span>
                    <span>{formatDate(order._creationTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}:</span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t("discount")}:</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                    <span>{t("total")}:</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>{t("orderItems")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <img
                        src={item.productImage || "/placeholder.jpg"}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t("quantity")}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} {t("each")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
