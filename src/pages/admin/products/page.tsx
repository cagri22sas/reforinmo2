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
import { PlusIcon, EditIcon, Trash2Icon, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";
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
    imageStorageIds?: Id<"_storage">[];
    images?: string[];
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
  const generateUploadUrl = useMutation(api.admin.products.generateUploadUrl);

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    categoryId: product?.categoryId || "",
    stock: product?.stock?.toString() || "0",
    sku: product?.sku || "",
    featured: product?.featured || false,
    active: product?.active ?? true,
  });
  
  const [uploadedImages, setUploadedImages] = useState<Id<"_storage">[]>(product?.imageStorageIds || []);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(product?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newStorageIds: Id<"_storage">[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        newStorageIds.push(storageId);
      }
      
      setUploadedImages([...uploadedImages, ...newStorageIds]);
      toast.success(`${newStorageIds.length} image(s) uploaded`);
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any images (either uploaded or existing URLs)
    if (uploadedImages.length === 0 && existingImageUrls.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        categoryId: formData.categoryId as Id<"categories">,
        imageStorageIds: uploadedImages.length > 0 ? uploadedImages : undefined,
        images: existingImageUrls.length > 0 ? existingImageUrls : undefined,
        stock: parseInt(formData.stock),
        sku: formData.sku || undefined,
        featured: formData.featured,
        active: formData.active,
      };

      if (product) {
        await updateProduct({ id: product._id, ...data });
        toast.success("Product updated");
      } else {
        await createProduct(data);
        toast.success("Product created");
      }

      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
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
          <Label htmlFor="name">Product Name *</Label>
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
              Generate
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
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
          <Label htmlFor="compareAtPrice">Compare At Price (EUR)</Label>
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
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
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
          <Label htmlFor="stock">Stock *</Label>
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
        <Label htmlFor="images">Product Images *</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {(existingImageUrls.length > 0 || uploadedImages.length > 0) && (
          <div className="flex gap-2 flex-wrap mt-2">
            {existingImageUrls.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative">
                <img
                  src={url}
                  alt={`Product ${idx + 1}`}
                  className="h-20 w-20 object-cover rounded border"
                />
                <Badge className="absolute -top-2 -right-2 text-xs" variant="secondary">
                  Mevcut
                </Badge>
              </div>
            ))}
            {uploadedImages.length > existingImageUrls.length && (
              <p className="text-sm text-muted-foreground self-center">
                + {uploadedImages.length - existingImageUrls.length} yeni resim yüklendi
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {product ? "Update" : "Create"}
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
  imageStorageIds?: Id<"_storage">[];
  images?: string[];
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
  const bulkDeleteProducts = useMutation(api.admin.products.bulkRemove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<Set<Id<"products">>>(new Set());

  if (products === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"products">) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id });
        toast.success("Product deleted");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      toast.error("No products selected");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)?`)) {
      try {
        await bulkDeleteProducts({ ids: Array.from(selectedProducts) as never[] });
        toast.success(`${selectedProducts.size} product(s) deleted`);
        setSelectedProducts(new Set());
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      }
    }
  };

  const toggleProduct = (id: Id<"products">) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const toggleAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p._id)));
    }
  };

  const isAllSelected = products.length > 0 && selectedProducts.size === products.length;

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {products.length} products found
            {selectedProducts.size > 0 && ` • ${selectedProducts.size} selected`}
          </p>
        </div>

        <div className="flex gap-2">
          {selectedProducts.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedProducts.size})
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <PlusIcon className="h-4 w-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Create New Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductDialog product={editingProduct} onClose={closeDialog} />
            </DialogContent>
          </Dialog>
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
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.has(product._id)}
                    onCheckedChange={() => toggleProduct(product._id)}
                    aria-label={`Select ${product.name}`}
                  />
                </TableCell>
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
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {product.featured && <Badge variant="default">Featured</Badge>}
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
                Please sign in to access this page
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
