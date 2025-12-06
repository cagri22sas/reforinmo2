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
import { Switch } from "@/components/ui/switch.tsx";
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

interface BrandFormData {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  order: string;
  active: boolean;
}

function BrandDialog({ 
  brand, 
  onClose 
}: { 
  brand?: {
    _id: Id<"brands">;
    name: string;
    logoUrl: string;
    websiteUrl?: string;
    order: number;
    active: boolean;
  }; 
  onClose: () => void;
}) {
  const createBrand = useMutation(api.admin.brands.create);
  const updateBrand = useMutation(api.admin.brands.update);

  const [formData, setFormData] = useState<BrandFormData>({
    name: brand?.name || "",
    logoUrl: brand?.logoUrl || "",
    websiteUrl: brand?.websiteUrl || "",
    order: brand?.order?.toString() || "0",
    active: brand?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        logoUrl: formData.logoUrl,
        websiteUrl: formData.websiteUrl || undefined,
        order: parseInt(formData.order),
        active: formData.active,
      };

      if (brand) {
        await updateBrand({ id: brand._id, ...data });
        toast.success("Brand updated");
      } else {
        await createBrand(data);
        toast.success("Brand created");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Brand Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Yamaha"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl">Logo URL *</Label>
        <Input
          id="logoUrl"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          placeholder="https://example.com/logo.png"
          required
        />
        {formData.logoUrl && (
          <div className="mt-2">
            <img
              src={formData.logoUrl}
              alt="Preview"
              className="h-16 w-auto object-contain border rounded p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order *</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {brand ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}

type Brand = {
  _id: Id<"brands">;
  _creationTime: number;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
  active: boolean;
};

function BrandsContent() {
  const brands = useQuery(api.admin.brands.list, {});
  const deleteBrand = useMutation(api.admin.brands.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);

  if (brands === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"brands">) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand({ id });
        toast.success("Brand deleted");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An error occurred");
        }
      }
    }
  };

  const openCreateDialog = () => {
    setEditingBrand(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBrand(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-muted-foreground">
            Manage partner brands displayed on homepage
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? "Edit Brand" : "Create New Brand"}
              </DialogTitle>
            </DialogHeader>
            <BrandDialog brand={editingBrand} onClose={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No brands yet. Create your first brand.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-10 w-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm text-muted-foreground">${brand.name}</span>`;
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{brand.name}</p>
                  </TableCell>
                  <TableCell>
                    {brand.websiteUrl ? (
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{brand.order}</TableCell>
                  <TableCell>
                    {brand.active ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(brand)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(brand._id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default function AdminBrandsPage() {
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
        <BrandsContent />
      </Authenticated>
    </AdminLayout>
  );
}
