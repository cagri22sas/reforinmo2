import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { EyeIcon, Trash2Icon, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

function OrderDetailDialog({ 
  orderId, 
  onClose 
}: { 
  orderId: Id<"orders">; 
  onClose: () => void;
}) {
  const orderData = useQuery(api.admin.orders.get, { orderId });
  const updateStatus = useMutation(api.admin.orders.updateStatus);
  const [status, setStatus] = useState<OrderStatus>("processing");
  const [trackingNumber, setTrackingNumber] = useState("");

  if (orderData === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const { customer, items, shippingMethod, ...order } = orderData;

  const handleUpdateStatus = async () => {
    try {
      await updateStatus({
        orderId,
        status,
        trackingNumber: trackingNumber || undefined,
      });
      toast.success("Sipariş durumu güncellendi");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bir hata oluştu");
      }
    }
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="font-semibold mb-2">Sipariş Bilgileri</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Sipariş No:</span> {order.orderNumber}</p>
            <p><span className="text-muted-foreground">Tarih:</span> {formatDate(order._creationTime)}</p>
            <p><span className="text-muted-foreground">Durum:</span> {order.status}</p>
            {order.trackingNumber && (
              <p><span className="text-muted-foreground">Takip No:</span> {order.trackingNumber}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Müşteri Bilgileri</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Ad:</span> {customer?.name}</p>
            <p><span className="text-muted-foreground">E-posta:</span> {customer?.email}</p>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
        <div className="text-sm space-y-1">
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
          <p>{order.shippingAddress.country}</p>
          <p>Tel: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="font-semibold mb-2">Ürünler</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="flex gap-3 p-3 bg-muted rounded-lg">
              <img
                src={item.productImage || "/placeholder.svg"}
                alt={item.productName}
                className="h-16 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <div className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ara Toplam:</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Kargo ({shippingMethod?.name}):</span>
          <span>{formatPrice(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Toplam:</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* Update Status */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold">Durumu Güncelle</h3>
        
        <div className="space-y-2">
          <Label>Yeni Durum</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="processing">İşleniyor</SelectItem>
              <SelectItem value="shipped">Kargoda</SelectItem>
              <SelectItem value="delivered">Teslim Edildi</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Takip Numarası (Opsiyonel)</Label>
          <Input
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Kargo takip numarası"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleUpdateStatus}>
            Durumu Güncelle
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const orders = useQuery(api.admin.orders.list, { status: statusFilter });
  const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<Id<"orders">>>(new Set());
  const deleteOrder = useMutation(api.admin.orders.remove);
  const bulkDeleteOrders = useMutation(api.admin.orders.bulkRemove);

  if (orders === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "Beklemede", variant: "secondary" as const },
      processing: { label: "İşleniyor", variant: "default" as const },
      shipped: { label: "Kargoda", variant: "default" as const },
      delivered: { label: "Teslim Edildi", variant: "success" as const },
      cancelled: { label: "İptal Edildi", variant: "destructive" as const },
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleDelete = async (orderId: Id<"orders">) => {
    if (confirm("Bu siparişi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteOrder({ orderId });
        toast.success("Sipariş silindi");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Bir hata oluştu");
        }
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.size === 0) {
      toast.error("Lütfen silinecek siparişleri seçin");
      return;
    }

    if (confirm(`${selectedOrders.size} siparişi silmek istediğinizden emin misiniz?`)) {
      try {
        await bulkDeleteOrders({ orderIds: Array.from(selectedOrders) as never[] });
        toast.success(`${selectedOrders.size} sipariş silindi`);
        setSelectedOrders(new Set());
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Bir hata oluştu");
        }
      }
    }
  };

  const toggleOrder = (orderId: Id<"orders">) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const toggleAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o._id)));
    }
  };

  const isAllSelected = orders.length > 0 && selectedOrders.size === orders.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Siparişler</h1>
          <p className="text-muted-foreground">
            {orders.length} sipariş bulundu
            {selectedOrders.size > 0 && ` • ${selectedOrders.size} seçili`}
          </p>
        </div>

        <div className="flex gap-2">
          {selectedOrders.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Seçilenleri Sil ({selectedOrders.size})
            </Button>
          )}
          <Select 
            value={statusFilter || "all"} 
            onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value as OrderStatus)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Siparişler</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="processing">İşleniyor</SelectItem>
              <SelectItem value="shipped">Kargoda</SelectItem>
              <SelectItem value="delivered">Teslim Edildi</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Tümünü seç"
                />
              </TableHead>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Ürün Sayısı</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusConfig = getStatusBadge(order.status);
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.has(order._id)}
                      onCheckedChange={() => toggleOrder(order._id)}
                      aria-label={`Sipariş ${order.orderNumber} seç`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order._creationTime)}</TableCell>
                  <TableCell>{order.itemCount}</TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOrderId(order._id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(order._id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={selectedOrderId !== null} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sipariş Detayları</DialogTitle>
          </DialogHeader>
          {selectedOrderId && (
            <OrderDetailDialog 
              orderId={selectedOrderId} 
              onClose={() => setSelectedOrderId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <Unauthenticated>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Bu sayfaya erişmek için giriş yapmalısınız
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </Unauthenticated>

      <AuthLoading>
        <Skeleton className="h-96 w-full" />
      </AuthLoading>

      <Authenticated>
        <OrdersContent />
      </Authenticated>
    </AdminLayout>
  );
}
