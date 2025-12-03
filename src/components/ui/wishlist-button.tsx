import { Heart } from "lucide-react";
import { Button } from "./button.tsx";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useState } from "react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { useAuth } from "@/hooks/use-auth.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.tsx";

interface WishlistButtonProps {
  productId: Id<"products">;
  variant?: "icon" | "text";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}

export function WishlistButton({
  productId,
  variant = "icon",
  size = "icon",
  className,
}: WishlistButtonProps) {
  const { user } = useAuth();
  const isInWishlist = useQuery(api.wishlist.isInWishlist, { productId });
  const toggleWishlist = useMutation(api.wishlist.toggleWishlist);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleWishlist({ productId });
      if (result.action === "added") {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to update wishlist");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "text") {
    return (
      <Button
        variant={isInWishlist ? "default" : "outline"}
        size={size}
        onClick={handleToggle}
        disabled={isLoading}
        className={className}
      >
        <Heart
          className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-current" : ""}`}
        />
        {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={handleToggle}
            disabled={isLoading}
            className={className}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
