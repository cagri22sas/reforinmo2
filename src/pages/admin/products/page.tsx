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
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
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
import { useNavigate } from "react-router-dom";

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  images: string;
  stock: string;
  sku: string;
  featured: boolean;
  active: boolean;
}

function ProductDialog({ 
  product, 
  onClose 
}: { 
  product?: {
    _id: Id<"products">;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    categoryId: Id<"categories">;
    images: string[];
    stock: number;
    sku?: string;
    featured: boolean;
    active: boolean;
  }; 
  onClose: () => void;
}) {
  const categories = useQuery(api.categories.list, {});
  const createProduct = useMutation(api.admin.products.create);
  const updateProduct = useMutation(api.admin.products.update);

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    categoryId: product?.categoryId || "",
    images: product?.images?.join("\n") || "",
    stock: product?.stock?.toString() || "0",
    sku: product?.sku || "",
    featured: product?.featured || false,
    active: product?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imagesArray = formData.images
        .split("\n")
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        categoryId: formData.categoryId as Id<"categories">,
        images: imagesArray,
        stock: parseInt(formData.stock),
        sku: formData.sku || undefined,
        featured: formData.featured,
        active: formData.active,
      };

      if (product) {
        await updateProduct({ id: product._id, ...data });
        toast.success("Ürün güncellendi");
      } else {
        await createProduct(data);
        toast.success("Ürün oluşturuldu");
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

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Ürün Adı *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <Button type="button" onClick={generateSlug} variant="outline">
              Oluştur
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Fiyat (TL) *</Label>
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
          <Label htmlFor="compareAtPrice">Karşılaştırma Fiyatı (TL)</Label>
          <Input
            id="compareAtPrice"
            type="number"
            step="0.01"
            value={formData.compareAtPrice}
            onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stok *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Resimler (Her satıra bir URL)</Label>
        <Textarea
          id="images"
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          rows={3}
          placeholder="https://example.com/image1.jpg"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Öne Çıkan</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <Label htmlFor="active">Aktif</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit">
          {product ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}

type Product = {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: Id<"categories">;
  images: string[];
  stock: number;
  sku?: string;
  featured: boolean;
  active: boolean;
  category: {
    _id: Id<"categories">;
    _creationTime: number;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    order: number;
  } | null;
};

function ProductsContent() {
  const navigate = useNavigate();
  const products = useQuery(api.admin.products.list, {});
  const deleteProduct = useMutation(api.admin.products.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  if (products === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"products">) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await deleteProduct({ id });
        toast.success("Ürün silindi");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Bir hata oluştu");
        }
      }
    }
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} TL`;

  const openCreateDialog = () => {
    setEditingProduct(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <p className="text-muted-foreground">
            {products.length} ürün bulundu
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Yeni Ürün
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}
              </DialogTitle>
            </DialogHeader>
            <ProductDialog product={editingProduct} onClose={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resim</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.slug}</p>
                  </div>
                </TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <span className={product.stock < 10 ? "text-destructive font-medium" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {product.active ? (
                      <Badge>Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Pasif</Badge>
                    )}
                    {product.featured && <Badge variant="default">Öne Çıkan</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(product)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product._id)}
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

export default function AdminProductsPage() {
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
        <ProductsContent />
      </Authenticated>
    </AdminLayout>
  );
}
