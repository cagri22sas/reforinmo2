import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShipIcon, ShieldCheckIcon, SparklesIcon, AwardIcon } from "lucide-react";

export default function Index() {
  const featuredProducts = useQuery(api.products.list, { featured: true });
  const categories = useQuery(api.categories.list, {});
  const seoSettings = useQuery(api.admin.seoSettings.get);

  // Create structured data for organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoSettings?.defaultTitle || "Luxury Marine Shop",
    description: seoSettings?.defaultDescription || "Premium marine platforms and accessories",
    url: window.location.origin,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent/5">
      <SEO
        title={seoSettings?.defaultTitle}
        description={seoSettings?.defaultDescription}
        keywords={seoSettings?.defaultKeywords}
        ogImage={seoSettings?.ogImage}
        canonicalUrl={window.location.origin}
        structuredData={structuredData}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1627761801957-4bf6cfb4fa20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/98 via-primary/5 to-background/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb,14,165,233),0.08),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Marine Lifestyle</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-balance mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Where Luxury <br/>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Meets the Sea
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 text-balance max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Experience the ultimate in floating luxury with our handcrafted marine platforms and accessories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/products">
                <Button size="lg" className="group text-base px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  Explore Collection
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-2xl border-2 hover:border-primary/50 transition-all duration-300">
                  View Catalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ShipIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On all orders over €500</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <ShieldCheckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">Powered by Stripe</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <AwardIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Handcrafted excellence</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <SparklesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Luxury Design</h3>
              <p className="text-sm text-muted-foreground">Elegant & timeless</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-background to-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 tracking-tight">Shop by Category</h2>
              <p className="text-xl text-muted-foreground">Discover our curated collections</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {categories.slice(0, 4).map((category, index) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-accent/10 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                    <div className="aspect-square relative overflow-hidden">
                      {category.imageUrl ? (
                        <>
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-6xl font-bold text-primary/30">{category.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Explore</span>
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 tracking-tight">Featured Collection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked luxury pieces for the discerning water enthusiast
            </p>
          </div>
          
          {!featuredProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[500px] w-full rounded-3xl" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No featured products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <div
                  key={product._id}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-700"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-2xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                View All Products
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1719391083606-da1dd6454a68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-primary-foreground tracking-tight">
            Begin Your Journey
          </h2>
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your aquatic experience with our exclusive collection of premium floating platforms
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-base px-10 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              Shop Collection
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
