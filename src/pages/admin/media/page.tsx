import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
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
import { 
  UploadIcon, 
  ImageIcon, 
  Trash2Icon, 
  CopyIcon, 
  CheckIcon, 
  XIcon, 
  SearchIcon,
  GridIcon,
  ListIcon,
  FileIcon,
  VideoIcon,
  FileTextIcon,
  DownloadIcon,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

type MediaItem = {
  _id: Id<"mediaLibrary">;
  _creationTime: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageId: Id<"_storage">;
  uploadedBy: Id<"users">;
  tags?: string[];
  alt?: string;
  url?: string | null;
  uploaderName?: string;
};

function MediaLibraryContent() {
  const media = useQuery(api.admin.media.list, {});
  const generateUploadUrl = useMutation(api.admin.media.generateUploadUrl);
  const createMedia = useMutation(api.admin.media.create);
  const updateMedia = useMutation(api.admin.media.update);
  const removeMedia = useMutation(api.admin.media.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<Set<Id<"mediaLibrary">>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  // Filtered and searched media
  const filteredMedia = useMemo(() => {
    if (!media) return [];
    
    let filtered = media;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((item) => {
        if (filterType === "image") return item.fileType.startsWith("image/");
        if (filterType === "video") return item.fileType.startsWith("video/");
        if (filterType === "document") return item.fileType.includes("pdf") || item.fileType.includes("document");
        return true;
      });
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.fileName.toLowerCase().includes(query) ||
        item.alt?.toLowerCase().includes(query) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [media, filterType, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    if (!media) return { total: 0, images: 0, videos: 0, documents: 0, totalSize: 0 };
    
    return {
      total: media.length,
      images: media.filter((m) => m.fileType.startsWith("image/")).length,
      videos: media.filter((m) => m.fileType.startsWith("video/")).length,
      documents: media.filter((m) => m.fileType.includes("pdf") || m.fileType.includes("document")).length,
      totalSize: media.reduce((sum, m) => sum + m.fileSize, 0),
    };
  }, [media]);

  if (media === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
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
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Silme işlemi başarısız oldu");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`${selectedItems.size} dosyayı silmek istediğinizden emin misiniz?`)) return;

    try {
      for (const id of selectedItems) {
        await removeMedia({ id });
      }
      toast.success(`${selectedItems.size} dosya silindi`);
      setSelectedItems(new Set());
    } catch (error) {
      toast.error("Toplu silme işlemi başarısız oldu");
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

  const toggleSelectItem = (id: Id<"mediaLibrary">) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredMedia.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredMedia.map((m) => m._id)));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return ImageIcon;
    if (fileType.startsWith("video/")) return VideoIcon;
    if (fileType.includes("pdf") || fileType.includes("document")) return FileTextIcon;
    return FileIcon;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medya Kütüphanesi</h1>
          <p className="text-muted-foreground">
            {stats.total} dosya · {formatFileSize(stats.totalSize)}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            accept="image/*,video/*,.pdf"
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.images}</p>
                <p className="text-xs text-muted-foreground">Resimler</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <VideoIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.videos}</p>
                <p className="text-xs text-muted-foreground">Videolar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileTextIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.documents}</p>
                <p className="text-xs text-muted-foreground">Dokümanlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Toplam</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drag and Drop Zone */}
      {media.length === 0 && (
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 transition-all ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UploadIcon />
              </EmptyMedia>
              <EmptyTitle>Dosyaları buraya sürükleyin</EmptyTitle>
              <EmptyDescription>
                veya tıklayarak dosya seçin
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => fileInputRef.current?.click()}>
                <UploadIcon className="h-4 w-4 mr-2" />
                Dosya Seç
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      )}

      {media.length > 0 && (
        <>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Dosya ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Dosyalar</SelectItem>
                <SelectItem value="image">Resimler</SelectItem>
                <SelectItem value="video">Videolar</SelectItem>
                <SelectItem value="document">Dokümanlar</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.size === filteredMedia.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedItems.size} dosya seçildi
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Seçilenleri Sil
              </Button>
            </div>
          )}

          {/* Media Grid/List */}
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Sonuç bulunamadı</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMedia.map((item) => {
                const FileIconComponent = getFileIcon(item.fileType);
                return (
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
                    <div className="group relative">
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedItems.has(item._id)}
                          onCheckedChange={() => toggleSelectItem(item._id)}
                          className="bg-background"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <DialogTrigger asChild>
                        <button className="w-full aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-xl relative">
                          {item.fileType.startsWith("image/") ? (
                            <img
                              src={item.url || ""}
                              alt={item.alt || item.fileName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-3">
                              <FileIconComponent className="h-12 w-12 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground px-2 text-center line-clamp-2">
                                {item.fileName}
                              </p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <p className="text-xs font-medium truncate w-full">
                              {item.fileName}
                            </p>
                          </div>
                        </button>
                      </DialogTrigger>
                    </div>

                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                              <div className="w-full h-full flex flex-col items-center justify-center bg-muted gap-4">
                                <FileIconComponent className="h-24 w-24 text-muted-foreground" />
                                <p className="text-sm text-center px-4">{item.fileName}</p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>URL</Label>
                              <div className="flex gap-2">
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
                                {item.url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                  >
                                    <a href={item.url} download={item.fileName}>
                                      <DownloadIcon className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                              </div>
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
                              <Badge variant="secondary" className="w-full justify-center">
                                {item.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <Label>Boyut</Label>
                              <Badge variant="secondary" className="w-full justify-center">
                                {formatFileSize(item.fileSize)}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Yükleyen</Label>
                            <Input value={item.uploaderName} readOnly />
                          </div>

                          <div className="space-y-2">
                            <Label>Yüklenme Tarihi</Label>
                            <Input 
                              value={new Date(item._creationTime).toLocaleDateString("tr-TR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })} 
                              readOnly 
                            />
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
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.tags.map((tag) => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
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
                );
              })}
            </div>
          ) : (
            <div className="border rounded-lg divide-y">
              {filteredMedia.map((item) => {
                const FileIconComponent = getFileIcon(item.fileType);
                return (
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
                    <div className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
                      <Checkbox
                        checked={selectedItems.has(item._id)}
                        onCheckedChange={() => toggleSelectItem(item._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                        {item.fileType.startsWith("image/") ? (
                          <img
                            src={item.url || ""}
                            alt={item.alt || item.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <FileIconComponent className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <DialogTrigger asChild>
                        <button className="flex-1 text-left">
                          <p className="font-medium truncate">{item.fileName}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{formatFileSize(item.fileSize)}</span>
                            <span>·</span>
                            <span>{new Date(item._creationTime).toLocaleDateString("tr-TR")}</span>
                            {item.tags && item.tags.length > 0 && (
                              <>
                                <span>·</span>
                                <div className="flex gap-1">
                                  {item.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {item.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{item.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </button>
                      </DialogTrigger>
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
                  </Dialog>
                );
              })}
            </div>
          )}
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
