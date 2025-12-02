import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
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

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    if (!product) return;

    try {
      await addToCart({ productId: product._id, quantity });
      toast.success(`${quantity} item${quantity > 1 ? 's' : ''} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please sign in to purchase");
      return;
    }

    if (!product) return;

    try {
      await addToCart({ productId: product._id, quantity });
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

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted mb-4">
                {product.images[selectedImage] ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-bold">
                    {discountPercentage}% OFF
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square relative overflow-hidden rounded-lg bg-muted border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
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
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.category && (
                <p className="text-sm text-muted-foreground mb-4">
                  Category: {product.category.name}
                </p>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">€{product.price.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through">
                      €{product.compareAtPrice!.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">In stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm">Out of stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>

              {/* Product Details */}
              {product.sku && (
                <div className="mt-8 pt-8 border-t">
                  <p className="text-sm text-muted-foreground">
                    SKU: <span className="text-foreground">{product.sku}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
