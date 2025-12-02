import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { UploadIcon, ImageIcon, Trash2Icon, CopyIcon, CheckIcon, XIcon } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

function MediaLibraryContent() {
  const media = useQuery(api.admin.media.list, {});
  const generateUploadUrl = useMutation(api.admin.media.generateUploadUrl);
  const createMedia = useMutation(api.admin.media.create);
  const updateMedia = useMutation(api.admin.media.update);
  const removeMedia = useMutation(api.admin.media.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  type MediaItem = NonNullable<typeof media> extends Array<infer U> ? U : never;
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (media === undefined) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await response.json();

        await createMedia({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          storageId: storageId as Id<"_storage">,
        });
      }
      toast.success(`${files.length} dosya yüklendi`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Dosya yüklenirken bir hata oluştu");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("URL kopyalandı");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (id: Id<"mediaLibrary">) => {
    if (!confirm("Bu medya dosyasını silmek istediğinizden emin misiniz?")) return;

    try {
      await removeMedia({ id });
      toast.success("Medya silindi");
      setSelectedMedia(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Silme işlemi başarısız oldu");
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedMedia) return;

    try {
      await updateMedia({
        id: selectedMedia._id,
        alt: editAlt || undefined,
        tags: editTags ? editTags.split(",").map((t) => t.trim()) : undefined,
      });
      toast.success("Medya güncellendi");
      setSelectedMedia(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Güncelleme başarısız oldu");
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Medya Kütüphanesi</h1>
          <p className="text-muted-foreground">
            Resim ve dosyalarınızı yönetin
          </p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            size="lg"
          >
            <UploadIcon className="h-4 w-4 mr-2" />
            {isUploading ? "Yükleniyor..." : "Dosya Yükle"}
          </Button>
        </div>
      </div>

      {media.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>Henüz medya yok</EmptyTitle>
            <EmptyDescription>
              İlk medya dosyanızı yükleyerek başlayın
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => fileInputRef.current?.click()}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Dosya Yükle
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>{media.length} dosya</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {media.map((item) => (
              <Dialog
                key={item._id}
                open={selectedMedia?._id === item._id}
                onOpenChange={(open) => {
                  if (open) {
                    setSelectedMedia(item);
                    setEditAlt(item.alt || "");
                    setEditTags(item.tags?.join(", ") || "");
                  } else {
                    setSelectedMedia(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-xl">
                    {item.fileType.startsWith("image/") ? (
                      <img
                        src={item.url || ""}
                        alt={item.alt || item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-xs font-medium truncate w-full">
                        {item.fileName}
                      </p>
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Medya Detayları</DialogTitle>
                    <DialogDescription>
                      Dosya bilgilerini görüntüleyin ve düzenleyin
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg overflow-hidden border">
                        {item.fileType.startsWith("image/") ? (
                          <img
                            src={item.url || ""}
                            alt={item.alt || item.fileName}
                            className="w-full h-full object-contain bg-muted"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="h-24 w-24 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>URL</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(item.url || "")}
                          >
                            {copiedUrl === item.url ? (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <CopyIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Input
                          value={item.url || ""}
                          readOnly
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Dosya Adı</Label>
                        <Input value={item.fileName} readOnly />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Dosya Tipi</Label>
                          <Badge variant="secondary">{item.fileType}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Label>Boyut</Label>
                          <Badge variant="secondary">
                            {formatFileSize(item.fileSize)}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Yükleyen</Label>
                        <Input value={item.uploaderName} readOnly />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alt">Alt Metni</Label>
                        <Input
                          id="alt"
                          value={editAlt}
                          onChange={(e) => setEditAlt(e.target.value)}
                          placeholder="Resim açıklaması..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                        <Input
                          id="tags"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="örnek, ürün, deniz"
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Sil
                    </Button>
                    <div className="flex gap-2 flex-1 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedMedia(null)}
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        İptal
                      </Button>
                      <Button onClick={handleUpdate}>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Güncelle
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminMediaPage() {
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
        <MediaLibraryContent />
      </Authenticated>
    </AdminLayout>
  );
}
