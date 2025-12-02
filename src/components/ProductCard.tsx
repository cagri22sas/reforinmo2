import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type Product = Doc<"products"> & {
  category: Doc<"categories"> | null;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useMutation(api.cart.add);
  const [sessionId, setSessionId] = useState<string>("");
  
  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestSessionId", id);
    }
    setSessionId(id);
  }, []);
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await addToCart({ productId: product._id, quantity: 1, sessionId });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group border-border/50 bg-card rounded-3xl">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-accent/10">
          {product.images[0] ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {discountPercentage}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-6">
        <div className="mb-4">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-bold text-lg line-clamp-2 hover:text-primary transition-colors mb-1">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category.name}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">€{product.price.toFixed(2)}</div>
            {hasDiscount && (
              <div className="text-sm text-muted-foreground line-through">
                €{product.compareAtPrice!.toFixed(2)}
              </div>
            )}
          </div>
          <Button 
            size="icon" 
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="rounded-2xl h-12 w-12 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <ShoppingCartIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
