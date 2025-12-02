import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  PackageIcon,
  ImageIcon,
  TagsIcon,
  SearchIcon,
  RulerIcon,
  WeightIcon,
  LinkIcon,
  UploadIcon,
  XIcon,
  CheckIcon,
  SaveIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/rich-text-editor.tsx";

function ProductEditorInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  
  const product = useQuery(api.admin.products.get, isEdit ? { id: id as Id<"products"> } : "skip");
  const categories = useQuery(api.categories.list, {});
  const allProducts = useQuery(api.admin.products.list, {});
  const createProduct = useMutation(api.admin.products.create);
  const updateProduct = useMutation(api.admin.products.update);
  const generateUploadUrl = useMutation(api.admin.products.generateUploadUrl);

  // Basic Info
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Pricing & Inventory
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [sku, setSku] = useState("");

  // Images
  const [images, setImages] = useState<Array<{ url: string; alt?: string; isPrimary: boolean }>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Status
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Specifications
  const [specifications, setSpecifications] = useState<Array<{ label: string; value: string }>>([]);
  const [specLabel, setSpecLabel] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Dimensions
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [dimensionUnit, setDimensionUnit] = useState("cm");

  // Weight
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  // Related Products
  const [relatedProducts, setRelatedProducts] = useState<Id<"products">[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data if editing
  useEffect(() => {
    if (product && isEdit) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description);
      setShortDescription(product.shortDescription || "");
      setCategoryId(product.categoryId);
      setPrice(product.price.toString());
      setCompareAtPrice(product.compareAtPrice?.toString() || "");
      setStock(product.stock.toString());
      setSku(product.sku || "");
      setImages(product.images || []);
      setActive(product.active);
      setFeatured(product.featured);
      setTags(product.tags || []);
      setSeoTitle(product.seoTitle || "");
      setSeoDescription(product.seoDescription || "");
      setSeoKeywords(product.seoKeywords || "");
      setSpecifications(product.specifications || []);
      setLength(product.dimensions?.length.toString() || "");
      setWidth(product.dimensions?.width.toString() || "");
      setHeight(product.dimensions?.height.toString() || "");
      setDimensionUnit(product.dimensions?.unit || "cm");
      setWeight(product.weight?.value.toString() || "");
      setWeightUnit(product.weight?.unit || "kg");
      setRelatedProducts(product.relatedProducts || []);
    }
  }, [product, isEdit]);

  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      // In a real app, you'd get the URL from storage
      // For now, we'll use a placeholder
      const newImage = {
        url: `https://cdn.hercules.app/${storageId}`,
        isPrimary: images.length === 0,
      };
      
      setImages([...images, newImage]);
      toast.success("Resim yüklendi");
    } catch (error) {
      toast.error("Resim yüklenirken hata oluştu");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If removed image was primary, make first image primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addSpecification = () => {
    if (specLabel && specValue) {
      setSpecifications([...specifications, { label: specLabel, value: specValue }]);
      setSpecLabel("");
      setSpecValue("");
    }
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const toggleRelatedProduct = (productId: Id<"products">) => {
    if (relatedProducts.includes(productId)) {
      setRelatedProducts(relatedProducts.filter((id) => id !== productId));
    } else {
      setRelatedProducts([...relatedProducts, productId]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name,
        slug,
        description,
        shortDescription: shortDescription || undefined,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
        categoryId: categoryId as Id<"categories">,
        images: images.length > 0 ? images : [{ url: "", isPrimary: true }],
        stock: parseInt(stock),
        sku: sku || undefined,
        active,
        featured,
        tags: tags.length > 0 ? tags : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords || undefined,
        specifications: specifications.length > 0 ? specifications : undefined,
        dimensions: length && width && height ? {
          length: parseFloat(length),
          width: parseFloat(width),
          height: parseFloat(height),
          unit: dimensionUnit,
        } : undefined,
        weight: weight ? {
          value: parseFloat(weight),
          unit: weightUnit,
        } : undefined,
        relatedProducts: relatedProducts.length > 0 ? relatedProducts : undefined,
      };

      if (isEdit) {
        await updateProduct({ id: id as Id<"products">, ...data });
        toast.success("Ürün güncellendi");
      } else {
        await createProduct(data);
        toast.success("Ürün oluşturuldu");
      }

      navigate("/admin/products");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bir hata oluştu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && product === undefined) {
    return (
      <AdminLayout>
        <Skeleton className="h-96 w-full" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/products")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}
              </h1>
              <p className="text-muted-foreground">
                {isEdit ? "Ürün bilgilerini güncelleyin" : "Yeni bir ürün ekleyin"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <SaveIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="h-5 w-5" />
                  Temel Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ürün Adı *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                    />
                    <Button type="button" onClick={generateSlug} variant="outline">
                      Oluştur
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Açıklama *</Label>
                  <RichTextEditor
                    content={description}
                    onChange={setDescription}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Kısa Açıklama</Label>
                  <Textarea
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={2}
                    placeholder="Ürün listelerinde gösterilecek kısa açıklama"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Ürün Resimleri
                </CardTitle>
                <CardDescription>Yüklemek için tıklayın veya sürükleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt || `Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {!image.isPrimary && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => setPrimaryImage(index)}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {image.isPrimary && (
                        <Badge className="absolute top-2 left-2">Ana Resim</Badge>
                      )}
                    </div>
                  ))}
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {uploadingImage ? "Yükleniyor..." : "Resim Ekle"}
                    </span>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SearchIcon className="h-5 w-5" />
                  SEO Ayarları
                </CardTitle>
                <CardDescription>Arama motorları için optimize edin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Başlığı</Label>
                  <Input
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder={name || "Ürün başlığı"}
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoTitle.length}/60 karakter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Açıklaması</Label>
                  <Textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={3}
                    placeholder="Ürünün arama sonuçlarında görünecek açıklaması"
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoDescription.length}/160 karakter
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">Anahtar Kelimeler</Label>
                  <Input
                    id="seoKeywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="yat, tekne, deniz ürünleri"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Teknik Özellikler</CardTitle>
                <CardDescription>Ürünün detaylı özelliklerini ekleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Özellik (ör: Renk)"
                    value={specLabel}
                    onChange={(e) => setSpecLabel(e.target.value)}
                  />
                  <Input
                    placeholder="Değer (ör: Beyaz)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                  />
                  <Button type="button" onClick={addSpecification}>
                    Ekle
                  </Button>
                </div>

                {specifications.length > 0 && (
                  <div className="space-y-2">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{spec.label}:</span> {spec.value}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSpecification(index)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dimensions & Weight */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RulerIcon className="h-5 w-5" />
                    Boyutlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label>Uzunluk</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Genişlik</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Yükseklik</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={dimensionUnit} onValueChange={setDimensionUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="in">inç</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WeightIcon className="h-5 w-5" />
                    Ağırlık
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Değer</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <Select value={weightUnit} onValueChange={setWeightUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Related Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  İlgili Ürünler
                </CardTitle>
                <CardDescription>Müşterilere önerilecek ürünler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allProducts?.filter((p) => p._id !== id).slice(0, 12).map((prod) => (
                    <div
                      key={prod._id}
                      onClick={() => toggleRelatedProduct(prod._id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        relatedProducts.includes(prod._id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {prod.images[0] && (
                          <img
                            src={typeof prod.images[0] === "string" ? prod.images[0] : prod.images[0].url}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{prod.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {prod.price.toFixed(2)} TL
                          </p>
                        </div>
                        {relatedProducts.includes(prod._id) && (
                          <CheckIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Durum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active">Aktif</Label>
                  <Switch
                    id="active"
                    checked={active}
                    onCheckedChange={setActive}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Öne Çıkan</Label>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={categoryId} onValueChange={setCategoryId} required>
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
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Fiyatlandırma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Fiyat (TL) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">Karşılaştırma Fiyatı</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Envanter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TagsIcon className="h-5 w-5" />
                  Etiketler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Etiket ekle"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Ekle
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default function ProductEditorPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Giriş Gerekli</h1>
            <p className="mb-4 text-muted-foreground">
              Bu sayfayı görüntülemek için giriş yapmalısınız
            </p>
            <SignInButton />
          </div>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Skeleton className="h-96 w-full max-w-7xl" />
        </div>
      </AuthLoading>
      <Authenticated>
        <ProductEditorInner />
      </Authenticated>
    </>
  );
}
