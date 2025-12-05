import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
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
import { PlusIcon, EditIcon, Trash2Icon, UploadIcon, XIcon } from "lucide-react";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  order: string;
}

function CategoryDialog({ 
  category, 
  onClose 
}: { 
  category?: {
    _id: Id<"categories">;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    order: number;
  }; 
  onClose: () => void;
}) {
  const createCategory = useMutation(api.admin.categories.create);
  const updateCategory = useMutation(api.admin.categories.update);
  const generateUploadUrl = useMutation(api.admin.categories.generateUploadUrl);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    imageUrl: category?.imageUrl || "",
    order: category?.order?.toString() || "0",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] = useState<Id<"_storage"> | null>(null);
  
  const getImageUrl = useQuery(
    api.admin.categories.getImageUrl,
    uploadedStorageId ? { storageId: uploadedStorageId } : "skip"
  );

  // When image URL is ready, update form
  useEffect(() => {
    if (getImageUrl) {
      setFormData((prev) => ({ ...prev, imageUrl: getImageUrl }));
      setUploadedStorageId(null);
      setSelectedFile(null);
      toast.success("Resim URL hazır!");
    }
  }, [getImageUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        order: parseInt(formData.order),
      };

      if (category) {
        await updateCategory({ id: category._id, ...data });
        toast.success("Kategori güncellendi");
      } else {
        await createCategory(data);
        toast.success("Kategori oluşturuldu");
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Lütfen bir resim dosyası seçin");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      toast.info("Resim yükleniyor...");
      
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      
      const { storageId } = await result.json();
      
      toast.info("Resim URL alınıyor...");
      setUploadedStorageId(storageId);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Resim yüklenirken hata oluştu");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setUploadedStorageId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Kategori Adı *</Label>
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

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Resim URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        
        {/* PC'den Yükleme */}
        <div className="mt-4 space-y-2">
          <Label>veya PC'den Yükle</Label>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {!selectedFile ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                <UploadIcon className="h-4 w-4 mr-2" />
                Dosya Seç
              </Button>
            ) : (
              <>
                <div className="flex-1 flex items-center gap-2 p-2 border rounded-md">
                  <span className="text-sm truncate">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Yükleniyor..." : "Yükle"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelUpload}
                  disabled={isUploading}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Önizleme */}
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Önizleme"
              className="h-24 w-24 object-cover rounded-md border"
            />
          </div>
        )}
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit">
          {category ? "Güncelle" : "Oluştur"}
        </Button>
      </div>
    </form>
  );
}

type Category = {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
};

function CategoriesContent() {
  const categories = useQuery(api.admin.categories.list, {});
  const deleteCategory = useMutation(api.admin.categories.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  if (categories === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleDelete = async (id: Id<"categories">) => {
    if (confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteCategory({ id });
        toast.success("Kategori silindi");
      } catch (error) {
        // Extract error message from Convex error
        let errorMessage = "Bir hata oluştu";
        
        if (error && typeof error === "object" && "data" in error) {
          const convexError = error as { data: { message?: string } };
          errorMessage = convexError.data.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage, {
          duration: 5000,
          description: "Kategoriyi silmek için önce içindeki ürünleri başka kategorilere taşıyın."
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategoriler</h1>
          <p className="text-muted-foreground">
            {categories.length} kategori bulundu
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(undefined)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
              </DialogTitle>
            </DialogHeader>
            <CategoryDialog 
              category={editingCategory} 
              onClose={() => {
                setIsDialogOpen(false);
                setEditingCategory(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resim</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <img
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description || "-"}
                </TableCell>
                <TableCell>{category.order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsDialogOpen(true);
                      }}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category._id)}
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

export default function AdminCategoriesPage() {
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
        <CategoriesContent />
      </Authenticated>
    </AdminLayout>
  );
}
