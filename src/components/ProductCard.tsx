import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.ts";
import type { Doc } from "@/convex/_generated/dataModel.d.ts";

type Product = Doc<"products"> & {
  category: Doc<"categories"> | null;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const addToCart = useMutation(api.cart.add);
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          {product.category && (
            <p className="text-xs text-muted-foreground mt-1">{product.category.name}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-bold">₺{product.price.toFixed(2)}</div>
            {hasDiscount && (
              <div className="text-sm text-muted-foreground line-through">
                ₺{product.compareAtPrice!.toFixed(2)}
              </div>
            )}
          </div>
          <Button 
            size="icon" 
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
