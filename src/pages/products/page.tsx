import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { useLanguage, translations } from "@/hooks/use-language.ts";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") as Id<"categories"> | null;
  const { language } = useLanguage();
  const t = translations[language];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | undefined>(initialCategory || undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest">("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  
  const categories = useQuery(api.categories.list);
  const products = useQuery(api.products.search, {
    searchQuery: debouncedSearch,
    categoryId: selectedCategory,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    inStock: inStockOnly,
    sortBy,
  });

  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory, selectedCategory]);

  const handleCategoryChange = (categoryId: Id<"categories"> | undefined) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setSortBy("newest");
    setSearchParams({});
  };

  const hasActiveFilters = 
    searchQuery.trim() !== "" ||
    selectedCategory !== undefined ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 10000 ||
    inStockOnly ||
    sortBy !== "newest";

  const selectedCategoryData = categories?.find((c) => c._id === selectedCategory);

  // Shuffle products randomly when no active filters (except category)
  const displayProducts = useMemo(() => {
    if (!products) return null;
    
    // Only shuffle when sortBy is "newest" and no other filters are active
    const shouldShuffle = 
      sortBy === "newest" && 
      searchQuery.trim() === "" &&
      priceRange[0] === 0 &&
      priceRange[1] === 10000 &&
      !inStockOnly;
    
    if (!shouldShuffle) return products;
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [products, sortBy, searchQuery, priceRange, inStockOnly]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {selectedCategoryData ? selectedCategoryData.name : t.allProducts}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategoryData ? selectedCategoryData.description : (language === 'en' ? 'Explore our complete premium collection' : 'Explora nuestra colección premium completa')}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" />
                      {t.filters}
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8"
                      >
                        {language === 'en' ? 'Clear' : 'Limpiar'}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search */}
                  <div className="space-y-2">
                    <Label>{t.search}</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={t.searchProducts}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label>{t.category}</Label>
                    <div className="space-y-2">
                      <Button
                        variant={!selectedCategory ? "default" : "outline"}
                        onClick={() => handleCategoryChange(undefined)}
                        className="w-full justify-start"
                        size="sm"
                      >
                        {language === 'en' ? 'All Categories' : 'Todas las Categorías'}
                      </Button>
                      {categories?.map((category) => (
                        <Button
                          key={category._id}
                          variant={selectedCategory === category._id ? "default" : "outline"}
                          onClick={() => handleCategoryChange(category._id)}
                          className="w-full justify-start"
                          size="sm"
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <Label>{t.priceRange}</Label>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-4"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">€{priceRange[0]}</span>
                      <span className="text-muted-foreground">€{priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                    />
                    <Label htmlFor="inStock" className="cursor-pointer">
                      {language === 'en' ? 'In Stock Only' : 'Solo en Stock'}
                    </Label>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2">
                    <Label>{t.sortBy}</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{language === 'en' ? 'Newest First' : 'Más Reciente'}</SelectItem>
                        <SelectItem value="price_asc">{language === 'en' ? 'Price: Low to High' : 'Precio: Menor a Mayor'}</SelectItem>
                        <SelectItem value="price_desc">{language === 'en' ? 'Price: High to Low' : 'Precio: Mayor a Menor'}</SelectItem>
                        <SelectItem value="name_asc">{language === 'en' ? 'Name: A to Z' : 'Nombre: A a Z'}</SelectItem>
                        <SelectItem value="name_desc">{language === 'en' ? 'Name: Z to A' : 'Nombre: Z a A'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden col-span-1">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t.filters}
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {language === 'en' ? 'Active' : 'Activo'}
                  </Badge>
                )}
              </Button>

              {showFilters && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Filters</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as Id<"categories">)}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label>Price Range</Label>
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">€{priceRange[0]}</span>
                        <span className="text-muted-foreground">€{priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock-mobile"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                      />
                      <Label htmlFor="inStock-mobile" className="cursor-pointer">
                        In Stock Only
                      </Label>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="price_asc">Price: Low to High</SelectItem>
                          <SelectItem value="price_desc">Price: High to Low</SelectItem>
                          <SelectItem value="name_asc">Name: A to Z</SelectItem>
                          <SelectItem value="name_desc">Name: Z to A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {displayProducts ? (
                    <>
                      {language === 'en' ? 'Showing' : 'Mostrando'} <span className="font-semibold text-foreground">{displayProducts.length}</span> {language === 'en' ? (displayProducts.length !== 1 ? 'products' : 'product') : (displayProducts.length !== 1 ? 'productos' : 'producto')}
                    </>
                  ) : (
                    t.loading
                  )}
                </p>
              </div>

              {/* Products */}
              {!displayProducts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 w-full" />
                  ))}
                </div>
              ) : displayProducts.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t.noResults}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t.noResultsDesc}
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters}>
                        {t.clearFilters}
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
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
