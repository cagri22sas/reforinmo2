import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty.tsx";
import { PackageIcon, ChevronRightIcon } from "lucide-react";

function OrdersContent() {
  const orders = useQuery(api.orders.list, {});

  if (orders === undefined) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageIcon />
          </EmptyMedia>
          <EmptyTitle>Henüz siparişiniz yok</EmptyTitle>
          <EmptyDescription>
            İlk siparişinizi vermek için ürünleri keşfedin
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/products" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Ürünleri Keşfet
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Beklemede", variant: "secondary" as const },
      processing: { label: "İşleniyor", variant: "default" as const },
      shipped: { label: "Kargoda", variant: "default" as const },
      delivered: { label: "Teslim Edildi", variant: "success" as const },
      cancelled: { label: "İptal Edildi", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} TL`;
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order._id} to={`/orders/${order._id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order._creationTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <p>Teslimat: {order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Toplam</p>
                  <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Siparişlerim</h1>
        <p className="text-muted-foreground">
          Tüm siparişlerinizi görüntüleyin ve takip edin
        </p>
      </div>

      <Unauthenticated>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Siparişlerinizi görüntülemek için giriş yapmalısınız
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </Unauthenticated>

      <AuthLoading>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </AuthLoading>

      <Authenticated>
        <OrdersContent />
      </Authenticated>
    </div>
  );
}
