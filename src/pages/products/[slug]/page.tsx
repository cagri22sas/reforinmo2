import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { StarRating } from "@/components/ui/star-rating.tsx";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCartIcon, 
  MinusIcon, 
  PlusIcon, 
  ArrowLeftIcon, 
  ShieldCheckIcon, 
  TruckIcon, 
  RotateCcwIcon, 
  CreditCardIcon,
  LockIcon,
  PackageCheckIcon,
  CheckCircle2Icon,
  ThumbsUpIcon,
  MessageSquareIcon,
  VerifiedIcon,
  PencilIcon,
  SaveIcon,
  XIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";
import { useLanguage } from "@/hooks/use-language.ts";
import { useGuestSession } from "@/hooks/use-guest-session.ts";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { WishlistButton } from "@/components/ui/wishlist-button.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import ProductImageGallery from "@/components/ui/product-image-gallery.tsx";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

function RelatedProducts({ productId, language }: { productId: Id<"products">; language: "en" | "es" }) {
  const relatedProducts = useQuery(api.products.getRelated, { productId, limit: 4 });

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-20 border-t pt-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-2">
          {language === "en" ? "You May Also Like" : "También Te Puede Gustar"}
        </h2>
        <p className="text-muted-foreground">
          {language === "en" ? "Discover similar products" : "Descubre productos similares"}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const sessionId = useGuestSession();
  const product = useQuery(api.products.get, { slug: slug! });
  const reviews = useQuery(api.reviews.getByProduct, product ? { productId: product._id } : "skip");
  const reviewStats = useQuery(api.reviews.getStats, product ? { productId: product._id } : "skip");
  const addToCart = useMutation(api.cart.add);
  const createReview = useMutation(api.reviews.create);
  const markHelpful = useMutation(api.reviews.markHelpful);
  const updateProduct = useMutation(api.admin.products.update);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const [quantity, setQuantity] = useState(1);
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Admin edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [uploadedStorageId, setUploadedStorageId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getImageUrl = useQuery(
    uploadedStorageId 
      ? api.products.getImageUrl 
      : "skip" as never,
    uploadedStorageId 
      ? { storageId: uploadedStorageId as never }
      : "skip" as never
  );

  const currentUser = useQuery(api.users.getCurrentUser, {});
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (product && !editPrice) {
      setEditPrice(product.price.toString());
      setEditImageUrl(product.images[0] || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // When image URL is fetched, update editImageUrl
  useEffect(() => {
    if (getImageUrl && uploadedStorageId) {
      setEditImageUrl(getImageUrl);
      toast.success("Image URL ready!");
    }
  }, [getImageUrl, uploadedStorageId]);

  const handleStartEdit = () => {
    if (!product) return;
    setEditPrice(product.price.toString());
    setEditImageUrl(product.images[0] || "");
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedFile(null);
    setUploadedStorageId("");
    if (product) {
      setEditPrice(product.price.toString());
      setEditImageUrl(product.images[0] || "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl({});

      // Step 2: Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();

      // Step 3: Store the storage ID - query will fetch the URL
      setUploadedStorageId(storageId);
      setEditImageUrl(""); // Clear URL field
      setSelectedFile(null);
      toast.success("Image uploaded! Getting URL...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!product) return;

    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!editImageUrl.trim()) {
      toast.error("Please enter a valid image URL or upload an image");
      return;
    }

    setIsSaving(true);
    try {
      // Always use images (URLs) - whether from upload or manual entry
      await updateProduct({
        id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price,
        compareAtPrice: product.compareAtPrice,
        categoryId: product.categoryId,
        images: [editImageUrl, ...(product.images?.slice(1) || [])],
        imageStorageIds: product.imageStorageIds,
        stock: product.stock,
        sku: product.sku,
        featured: product.featured,
        active: product.active,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        seoKeywords: product.seoKeywords,
        specifications: product.specifications,
      });
      toast.success("Product updated successfully!");
      setIsEditMode(false);
      setUploadedStorageId("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !sessionId) return;

    try {
      await addToCart({ productId: product._id, quantity, sessionId });
      toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    }
  };

  const handleBuyNow = async () => {
    if (!product || !sessionId) return;

    try {
      await addToCart({ productId: product._id, quantity, sessionId });
      navigate("/cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmittingReview(true);
    try {
      await createReview({
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      toast.success("Review submitted! It will be visible after admin approval.");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      // Generate a simple user fingerprint based on browser/device info
      const userFingerprint = `${navigator.userAgent}-${screen.width}x${screen.height}`.substring(0, 100);
      await markHelpful({ 
        reviewId: reviewId as never,
        userFingerprint 
      });
      toast.success("Thank you for your feedback!");
    } catch (error) {
      toast.error("Failed to mark as helpful");
    }
  };

  if (product === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-[600px] w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/products">
              <Button>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  // SEO and structured data
  const seoTitle = product.seoTitle || `${product.name} - Buy Online`;
  const seoDescription = product.seoDescription || product.description;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: window.location.href,
    },
    brand: {
      "@type": "Brand",
      name: product.category?.name || "Shop",
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={product.seoKeywords}
        ogImage={product.images[0]}
        ogType="product"
        canonicalUrl={window.location.href}
        structuredData={structuredData}
      />
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
              Products
            </Link>
            {product.category && (
              <>
                <span className="mx-2 text-muted-foreground">/</span>
                <Link
                  to={`/products?category=${product.categoryId}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-sm">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="lg:col-span-7">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                discountBadge={
                  hasDiscount ? (
                    <div className="bg-gradient-to-r from-destructive to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-in zoom-in-50">
                      SAVE {discountPercentage}%
                    </div>
                  ) : undefined
                }
                stockBadge={
                  product.stock > 0 && product.stock < 10 ? (
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      Only {product.stock} left!
                    </div>
                  ) : undefined
                }
              />

              {/* Trust Badges Below Images */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <ShieldCheckIcon className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <TruckIcon className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <RotateCcwIcon className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <PackageCheckIcon className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs font-medium text-muted-foreground">Quality Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Header */}
                <div>
                  {product.category && (
                    <Badge variant="secondary" className="mb-3">
                      {product.category.name}
                    </Badge>
                  )}
                  <h1 className="text-4xl font-bold mb-3 leading-tight">{product.name}</h1>
                  
                  {/* Stock Status */}
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">In Stock - Ready to Ship</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-sm font-medium text-red-600">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  {isEditMode ? (
                    <div className="space-y-3 p-4 border-2 border-primary rounded-lg bg-primary/5">
                      <div>
                        <Label htmlFor="editPrice" className="text-sm font-semibold mb-2">
                          Price (€)
                        </Label>
                        <Input
                          id="editPrice"
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="h-12 text-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editImageUrl" className="text-sm font-semibold mb-2">
                          Main Image URL
                        </Label>
                        <Input
                          id="editImageUrl"
                          type="url"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="imageFile" className="text-sm font-semibold mb-2">
                          Or Upload Image from PC
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="imageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="h-12"
                          />
                          <Button
                            type="button"
                            onClick={handleUploadImage}
                            disabled={!selectedFile || isUploading}
                            variant="secondary"
                            size="lg"
                          >
                            {isUploading ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                        {selectedFile && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                        {uploadedStorageId && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                              ✓ Image uploaded successfully! Click Save to apply.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="flex-1"
                          size="lg"
                        >
                          <SaveIcon className="mr-2 h-4 w-4" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          variant="outline"
                          size="lg"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">€{product.price.toFixed(2)}</span>
                        {hasDiscount && (
                          <>
                            <span className="text-lg text-muted-foreground line-through">
                              €{product.compareAtPrice!.toFixed(2)}
                            </span>
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                              Save {discountPercentage}%
                            </Badge>
                          </>
                        )}
                        {isAdmin && (
                          <Button
                            onClick={handleStartEdit}
                            size="sm"
                            variant="outline"
                            className="ml-auto"
                          >
                            <PencilIcon className="mr-2 h-3 w-3" />
                            Quick Edit
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Tax included · Free shipping over €500</p>
                    </>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description.split('.').slice(0, 2).join('.') + (product.description.split('.').length > 2 ? '.' : '')}
                  </p>
                </div>

                <Separator />

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div>
                    <label className="text-sm font-semibold mb-3 block">Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 rounded-lg overflow-hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-none"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <MinusIcon className="h-5 w-5" />
                        </Button>
                        <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-none"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <PlusIcon className="h-5 w-5" />
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.stock} available
                      </span>
                    </div>
                  </div>
                )}

                {/* Add to Cart Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCartIcon className="mr-3 h-6 w-6" />
                    Add to Cart
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="flex-1 h-14 text-lg font-semibold"
                      disabled={product.stock === 0}
                      onClick={handleBuyNow}
                    >
                      Buy Now
                    </Button>
                    <WishlistButton
                      productId={product._id}
                      variant="text"
                      size="lg"
                      className="h-14 px-6"
                    />
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Free shipping on orders over €500</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Secure payment with SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </div>
                </div>

                {/* SKU */}
                {product.sku && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      SKU: <span className="text-foreground font-medium">{product.sku}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProducts productId={product._id} language={language} />

          {/* Reviews Section - Only show if there are reviews */}
          {reviews !== undefined && reviews.length > 0 && (
            <div className="mt-20">
              <div className="flex items-start justify-between mb-8 gap-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Customer Reviews</h2>
                  {reviewStats && reviewStats.totalReviews > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={reviewStats.averageRating} size="md" />
                        <span className="text-2xl font-bold">{reviewStats.averageRating.toFixed(1)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  variant="default"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </div>

              {/* Write a Review Form - Toggle visibility */}
              {showReviewForm && (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                  <Authenticated>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div>
                        <Label className="text-base mb-3 block">Rating</Label>
                        <StarRating
                          rating={reviewRating}
                          size="lg"
                          interactive
                          onRatingChange={setReviewRating}
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewTitle" className="text-base mb-2">Review Title</Label>
                        <Input
                          id="reviewTitle"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="Sum up your experience"
                          required
                          className="h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewComment" className="text-base mb-2">Your Review</Label>
                        <Textarea
                          id="reviewComment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your thoughts about this product"
                          required
                          className="min-h-[150px] resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmittingReview}
                        className="w-full sm:w-auto"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                    </Authenticated>
                    <Unauthenticated>
                      <div className="text-center py-8">
                        <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Sign in to write a review
                        </p>
                        <SignInButton />
                      </div>
                    </Unauthenticated>
                  </CardContent>
                </Card>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews === undefined ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full" />
                    ))}
                  </div>
                ) : (
                  reviews.map((review) => (
                    <Card key={review._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-sm font-bold text-primary">
                                    {review.userName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{review.userName}</span>
                                    {review.verifiedPurchase && (
                                      <Badge variant="secondary" className="gap-1">
                                        <VerifiedIcon className="h-3 w-3" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                  <StarRating rating={review.rating} size="sm" />
                                </div>
                              </div>
                            </div>
                            <h4 className="font-semibold text-lg mb-2">{review.title}</h4>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                {new Date(review._creationTime).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkHelpful(review._id)}
                                className="gap-2"
                              >
                                <ThumbsUpIcon className="h-4 w-4" />
                                Helpful ({review.helpfulCount})
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
