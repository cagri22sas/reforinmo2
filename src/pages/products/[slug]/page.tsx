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
  VerifiedIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = useQuery(api.products.get, { slug: slug! });
  const reviews = useQuery(api.reviews.getByProduct, product ? { productId: product._id } : "skip");
  const reviewStats = useQuery(api.reviews.getStats, product ? { productId: product._id } : "skip");
  const addToCart = useMutation(api.cart.add);
  const createReview = useMutation(api.reviews.create);
  const markHelpful = useMutation(api.reviews.markHelpful);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestSessionId", id);
    }
    setSessionId(id);
  }, []);

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
      toast.success("Review submitted successfully!");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpful({ reviewId: reviewId as never });
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

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted via-background to-accent/10">
                  {product.images[selectedImage] ? (
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-destructive to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-in zoom-in-50">
                      SAVE {discountPercentage}%
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      Only {product.stock} left!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg bg-muted border-3 transition-all hover:scale-105 ${
                        selectedImage === index ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges Below Images */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="group relative flex flex-col items-center text-center p-5 bg-gradient-to-br from-background to-muted/30 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheckIcon className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-semibold relative">Secure Payment</span>
                </div>
                <div className="group relative flex flex-col items-center text-center p-5 bg-gradient-to-br from-background to-muted/30 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <TruckIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold relative">Fast Shipping</span>
                </div>
                <div className="group relative flex flex-col items-center text-center p-5 bg-gradient-to-br from-background to-muted/30 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <RotateCcwIcon className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-xs font-semibold relative">Easy Returns</span>
                </div>
                <div className="group relative flex flex-col items-center text-center p-5 bg-gradient-to-br from-background to-muted/30 rounded-2xl hover:shadow-lg transition-all duration-300 border border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                    <PackageCheckIcon className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs font-semibold relative">Quality Guaranteed</span>
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
                <Card className="bg-muted/30 border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-5xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                      {hasDiscount && (
                        <div className="flex flex-col">
                          <span className="text-xl text-muted-foreground line-through">
                            €{product.compareAtPrice!.toFixed(2)}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            You save €{(product.compareAtPrice! - product.price).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Tax included. Shipping calculated at checkout.</p>
                  </CardContent>
                </Card>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
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
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full h-14 text-lg font-semibold"
                    disabled={product.stock === 0}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
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

          {/* Reviews Section */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
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
            </div>

            {/* Rating Distribution */}
            {reviewStats && reviewStats.totalReviews > 0 && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5];
                      const percentage = reviewStats.totalReviews > 0 
                        ? (count / reviewStats.totalReviews) * 100 
                        : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm font-medium w-12">{rating} stars</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Write a Review */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
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

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews === undefined ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquareIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No reviews yet</p>
                    <p className="text-muted-foreground">Be the first to review this product!</p>
                  </CardContent>
                </Card>
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
