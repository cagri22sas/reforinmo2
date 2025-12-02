import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useParams, Link } from "react-router-dom";
import { ShoppingCartIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from "lucide-react";
import { useState } from "react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = useQuery(api.products.get, { slug: slug! });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
            <h1 className="text-3xl font-bold mb-4">Ürün Bulunamadı</h1>
            <p className="text-muted-foreground mb-8">Aradığınız ürün mevcut değil.</p>
            <Link to="/products">
              <Button>
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Ürünlere Dön
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
              Ürünler
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
                    Görsel Yok
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm font-bold">
                    %{discountPercentage} İNDİRİM
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
                  Kategori: {product.category.name}
                </p>
              )}

              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">₺{product.price.toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₺{product.compareAtPrice!.toFixed(2)}
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
                    <span className="text-sm">Stokta mevcut ({product.stock} adet)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm">Stokta yok</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Adet</label>
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
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Sepete Ekle
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
