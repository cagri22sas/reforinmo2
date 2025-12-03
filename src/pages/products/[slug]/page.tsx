import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
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
  CheckCircle2Icon
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = useQuery(api.products.get, { slug: slug! });
  const addToCart = useMutation(api.cart.add);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sessionId, setSessionId] = useState<string>("");

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
              <Card className="overflow-hidden border-2">
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-accent/10">
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
                    <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-in zoom-in-50">
                      SAVE {discountPercentage}%
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      Only {product.stock} left!
                    </div>
                  )}
                </div>
              </Card>
              
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
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <ShieldCheckIcon className="h-8 w-8 text-primary mb-2" />
                  <span className="text-xs font-medium">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <TruckIcon className="h-8 w-8 text-primary mb-2" />
                  <span className="text-xs font-medium">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <RotateCcwIcon className="h-8 w-8 text-primary mb-2" />
                  <span className="text-xs font-medium">Easy Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-lg">
                  <PackageCheckIcon className="h-8 w-8 text-primary mb-2" />
                  <span className="text-xs font-medium">Quality Guaranteed</span>
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

                {/* Security & Payment Info */}
                <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <LockIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <p className="font-semibold text-sm text-green-900 dark:text-green-100">
                          Secure Checkout Guaranteed
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Your payment information is processed securely. We do not store credit card details.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <CreditCardIcon className="h-5 w-5 text-green-600" />
                          <span className="text-xs font-medium text-green-800 dark:text-green-200">
                            Powered by Stripe
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
        </div>
      </div>

      <Footer />
    </div>
  );
}
