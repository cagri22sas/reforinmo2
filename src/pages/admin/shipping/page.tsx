import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";

interface ShippingFormData {
  name: string;
  description: string;
  price: string;
  estimatedDays: string;
  active: boolean;
  order: string;
}

function ShippingDialog({ 
  method, 
  onClose 
}: { 
  method?: {
    _id: Id<"shippingMethods">;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    active: boolean;
    order: number;
  }; 
  onClose: () => void;
}) {
  const createMethod = useMutation(api.admin.shipping.create);
  const updateMethod = useMutation(api.admin.shipping.update);

  const [formData, setFormData] = useState<ShippingFormData>({
    name: method?.name || "",
    description: method?.description || "",
    price: method?.price?.toString() || "0",
    estimatedDays: method?.estimatedDays || "",
    active: method?.active ?? true,
    order: method?.order?.toString() || "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        estimatedDays: formData.estimatedDays,
        active: formData.active,
        order: parseInt(formData.order),
      };

      if (method) {
        await updateMethod({ id: method._id, ...data });
        toast.success("Kargo yöntemi güncellendi");
      } else {
        await createMethod(data);
        toast.success("Kargo yöntemi oluşturuldu");
      }

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bir hata oluştu");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Kargo Adı *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (EUR) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedDays">Tahmini Süre *</Label>
          <Input
            id="estimatedDays"
            value={formData.estimatedDays}
            onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
            placeholder="1-3 iş günü"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Sıra *</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Aktif</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit">
          {method ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}

type ShippingMethod = {
  _id: Id<"shippingMethods">;
  _creationTime: number;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  active: boolean;
  order: number;
};

function ShippingContent() {
  const methods = useQuery(api.admin.shipping.list, {});
  const deleteMethod = useMutation(api.admin.shipping.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | undefined>(undefined);

  if (methods === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"shippingMethods">) => {
    if (confirm("Bu kargo yöntemini silmek istediğinizden emin misiniz?")) {
      try {
        await deleteMethod({ id });
        toast.success("Kargo yöntemi silindi");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Bir hata oluştu");
        }
      }
    }
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kargo Yöntemleri</h1>
          <p className="text-muted-foreground">
            {methods.length} kargo yöntemi bulundu
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMethod(undefined)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Yeni Kargo Yöntemi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? "Kargo Yöntemi Düzenle" : "Yeni Kargo Yöntemi"}
              </DialogTitle>
            </DialogHeader>
            <ShippingDialog 
              method={editingMethod} 
              onClose={() => {
                setIsDialogOpen(false);
                setEditingMethod(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kargo Yöntemi</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Tahmini Süre</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
              <TableRow key={method._id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell className="max-w-xs truncate">{method.description}</TableCell>
                <TableCell>{formatPrice(method.price)}</TableCell>
                <TableCell>{method.estimatedDays}</TableCell>
                <TableCell>{method.order}</TableCell>
                <TableCell>
                  {method.active ? (
                    <Badge>Aktif</Badge>
                  ) : (
                    <Badge variant="secondary">Pasif</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingMethod(method);
                        setIsDialogOpen(true);
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(method._id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function AdminShippingPage() {
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
        <ShippingContent />
      </Authenticated>
    </AdminLayout>
  );
}
