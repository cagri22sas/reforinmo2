import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useSearchParams } from "react-router-dom";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get("category") as Id<"categories"> | null;
  
  const products = useQuery(api.products.list, categoryId ? { categoryId } : {});
  const categories = useQuery(api.categories.list);

  const selectedCategory = categories?.find((c) => c._id === categoryId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {selectedCategory ? selectedCategory.name : "All Products"}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory ? selectedCategory.description : "Explore our complete premium collection"}
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex gap-2 flex-wrap">
            <Button
              variant={!categoryId ? "default" : "outline"}
              onClick={() => setSearchParams({})}
            >
              All
            </Button>
            {categories?.map((category) => (
              <Button
                key={category._id}
                variant={categoryId === category._id ? "default" : "outline"}
                onClick={() => setSearchParams({ category: category._id })}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {!products ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products available in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
