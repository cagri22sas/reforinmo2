import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useParams, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ArrowLeftIcon, PackageIcon, TruckIcon, MapPinIcon, CreditCardIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-language.ts";

function OrderDetailContent({ orderId }: { orderId: Id<"orders"> }) {
  const { t } = useTranslation();
  const orderData = useQuery(api.orders.get, { orderId });

  if (orderData === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const { items, shippingMethod, ...order } = orderData;

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: { 
        label: t("pending"), 
        variant: "secondary" as const,
        description: t("pending"),
        icon: PackageIcon
      },
      processing: { 
        label: t("orderProcessing"), 
        variant: "default" as const,
        description: t("preparing"),
        icon: PackageIcon
      },
      shipped: { 
        label: t("shipped"), 
        variant: "default" as const,
        description: t("shipped_status"),
        icon: TruckIcon
      },
      delivered: { 
        label: t("delivered"), 
        variant: "success" as const,
        description: t("delivered_status"),
        icon: MapPinIcon
      },
      cancelled: { 
        label: t("cancelled"), 
        variant: "destructive" as const,
        description: t("cancelled_status"),
        icon: PackageIcon
      },
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getOrderTimeline = () => {
    const timeline = [
      { status: 'pending', label: t("orderReceived"), completed: true },
      { status: 'processing', label: t("preparing"), completed: order.status !== 'pending' },
      { status: 'shipped', label: t("shipped_status"), completed: order.status === 'shipped' || order.status === 'delivered' },
      { status: 'delivered', label: t("delivered_status"), completed: order.status === 'delivered' },
    ];
    
    if (order.status === 'cancelled') {
      return [{ status: 'cancelled', label: t("cancelled_status"), completed: true }];
    }
    
    return timeline;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const statusInfo = getStatusInfo(order.status);

  const timeline = getOrderTimeline();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{order.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("orderDate")}: {formatDate(order._creationTime)}
              </p>
            </div>
            <div className="text-right">
              <Badge variant={statusInfo.variant} className="mb-2 gap-1.5">
                <StatusIcon className="h-3.5 w-3.5" />
                {statusInfo.label}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {statusInfo.description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            {t("orderTracking")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {timeline.map((step, index) => {
              const isLast = index === timeline.length - 1;
              return (
                <div key={step.status} className="relative pb-8 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        step.completed 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border bg-background text-muted-foreground'
                      }`}>
                        {step.completed ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full border-2 border-current" />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`absolute top-10 h-full w-0.5 transition-colors ${
                          step.completed ? 'bg-primary' : 'bg-border'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.completed && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order._creationTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="h-5 w-5" />
              {t("orderItems")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4">
                <img
                  src={item.productImage || "/placeholder.svg"}
                  alt={item.productName}
                  className="h-20 w-20 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.productName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("quantity")}: {item.quantity}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t("total")}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPinIcon className="h-5 w-5" />
                {t("shippingDeliveryInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TruckIcon className="h-5 w-5" />
                {t("shippingMethod")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{shippingMethod?.name}</p>
              <p className="text-muted-foreground">{shippingMethod?.description}</p>
              {order.trackingNumber && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">{t("trackingNumber")}</p>
                  <p className="font-mono font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCardIcon className="h-5 w-5" />
                {t("payment")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">
                {order.stripePaymentIntentId ? t("paidByCard") : t("awaitingPayment")}
              </p>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("notes")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {order.notes}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t("returnToOrders")}
          </Button>
        </Link>
      </div>

      <Unauthenticated>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {t("viewOrderDetails")}
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </Unauthenticated>

      <AuthLoading>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AuthLoading>

      <Authenticated>
        {id && <OrderDetailContent orderId={id as Id<"orders">} />}
      </Authenticated>
    </div>
  );
}
