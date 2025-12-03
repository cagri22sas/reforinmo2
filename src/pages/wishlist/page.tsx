import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty.tsx";
import { Heart, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import SEO from "@/components/SEO.tsx";
import { useState, useEffect } from "react";
import { useLanguage, translations } from "@/hooks/use-language.ts";

function WishlistContent() {
  const wishlistItems = useQuery(api.wishlist.getWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);
  const addToCart = useMutation(api.cart.add);
  const [sessionId, setSessionId] = useState<string>("");
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestSessionId", id);
    }
    setSessionId(id);
  }, []);

  const handleRemove = async (productId: Id<"products">) => {
    try {
      await removeFromWishlist({ productId });
      toast.success(t.removeFromWishlist);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error(t.errorOccurred);
      }
    }
  };

  const handleAddToCart = async (productId: Id<"products">) => {
    try {
      await addToCart({ productId, quantity: 1, sessionId });
      toast.success(t.addToCart);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error(t.errorOccurred);
      }
    }
  };

  if (wishlistItems === undefined) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>{t.wishlistEmpty}</EmptyTitle>
            <EmptyDescription>
              {t.wishlistEmptyDesc}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link to="/products">{t.products}</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t.myWishlistTitle}</h1>
        <p className="text-muted-foreground">
          {wishlistItems.length} {wishlistItems.length === 1 ? (language === 'en' ? 'item' : 'artículo') : (language === 'en' ? 'items' : 'artículos')}{" "}
          {language === 'en' ? 'saved' : 'guardados'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          if (!item.product) return null;

          const product = item.product;
          const discount = product.compareAtPrice
            ? Math.round(
                ((product.compareAtPrice - product.price) /
                  product.compareAtPrice) *
                  100
              )
            : 0;

          return (
            <Card key={item._id} className="group relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={() => handleRemove(product._id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <Link to={`/products/${product.slug}`}>
                <CardHeader className="pt-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-xl -mx-6 -mt-6 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {discount > 0 && (
                    <div className="absolute top-20 left-2">
                      <span className="bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <CardTitle className="line-clamp-2 text-lg">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
              </Link>

              <CardContent>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? t.outOfStock : t.addToCart}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <>
      <SEO
        title={t.myWishlistTitle}
        description={language === 'en' ? 'View and manage your favorite products' : 'Ver y gestionar tus productos favoritos'}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Unauthenticated>
            <div className="container mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Heart />
                  </EmptyMedia>
                  <EmptyTitle>{language === 'en' ? 'Sign in to view your wishlist' : 'Inicia sesión para ver tu lista de deseos'}</EmptyTitle>
                  <EmptyDescription>
                    {language === 'en' ? 'Save your favorite products for later' : 'Guarda tus productos favoritos para más tarde'}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <SignInButton />
                </EmptyContent>
              </Empty>
            </div>
          </Unauthenticated>

          <AuthLoading>
            <div className="container mx-auto px-4 py-12">
              <div className="mb-8">
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-6 w-96" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[400px] w-full" />
                ))}
              </div>
            </div>
          </AuthLoading>

          <Authenticated>
            <WishlistContent />
          </Authenticated>
        </main>
        <Footer />
      </div>
    </>
  );
}
