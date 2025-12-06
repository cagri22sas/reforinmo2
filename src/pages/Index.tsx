import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import Testimonials from "@/components/Testimonials.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShipIcon, ShieldCheckIcon, SparklesIcon, AwardIcon, WavesIcon, UsersIcon, LeafIcon, ClockIcon } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useMemo } from "react";
import { useLanguage, translations } from "@/hooks/use-language.ts";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Interactive 3D Product Card Component
function Interactive3DProductCard({ product, index }: { product: {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
}; index: number }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);
        
        rotateY.set(percentX * 10);
        rotateX.set(-percentY * 10);
      }}
      onMouseLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
      whileHover={{ z: 50 }}
      className="group relative"
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 shadow-2xl transition-all duration-500 group-hover:shadow-primary/20 group-hover:border-primary/30">
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              src={product.images?.[0] || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Floating Badge */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-xs font-bold text-white shadow-lg"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              PREMIUM
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <motion.h3
                className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                style={{ transformStyle: "preserve-3d", z: 20 }}
              >
                {product.name}
              </motion.h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                €{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  €{product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Interactive Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-2"
            >
              <div className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-center shadow-lg group-hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <span>View Details</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* 3D Depth Effect - Corner Glow */}
          <div className="absolute -z-10 -inset-1 bg-gradient-to-br from-primary/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Index() {
  const featuredProductsRaw = useQuery(api.products.list, { featured: true });
  const categories = useQuery(api.categories.list, {});
  const brands = useQuery(api.brands.list, {});
  const seoSettings = useQuery(api.admin.seoSettings.get);
  const { language } = useLanguage();
  const t = translations[language];
  
  // Category IDs for platforms and water toys
  const platformAndWaterToysCategories = useMemo(() => {
    if (!categories) return [];
    return categories
      .filter(cat => 
        cat.name === "Water Sports" ||
        cat.name === "HEX Platforms" ||
        cat.name === "Square Platforms & Pavilions" ||
        cat.name === "Premium Teak Platforms" ||
        cat.name === "Docks & Multi-Use Platforms"
      )
      .map(cat => cat._id);
  }, [categories]);
  
  // Premium Collection: Only platforms and water toys
  const premiumCollectionProducts = useMemo(() => {
    if (!featuredProductsRaw || platformAndWaterToysCategories.length === 0) return undefined;
    return shuffleArray(
      featuredProductsRaw.filter(product => 
        platformAndWaterToysCategories.includes(product.categoryId)
      )
    );
  }, [featuredProductsRaw, platformAndWaterToysCategories]);
  
  // Featured Products: Exclude platforms and water toys
  const featuredProducts = useMemo(() => {
    if (!featuredProductsRaw || platformAndWaterToysCategories.length === 0) return undefined;
    return shuffleArray(
      featuredProductsRaw.filter(product => 
        !platformAndWaterToysCategories.includes(product.categoryId)
      )
    );
  }, [featuredProductsRaw, platformAndWaterToysCategories]);
  
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const percentX = (e.clientX - centerX) / (rect.width / 2);
        const percentY = (e.clientY - centerY) / (rect.height / 2);
        
        mouseX.set(percentX * 20);
        mouseY.set(percentY * 20);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Create structured data for organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoSettings?.defaultTitle || "Luxury Marine Shop",
    description: seoSettings?.defaultDescription || "Premium marine platforms and accessories",
    url: window.location.origin,
  };

  const features = [
    { icon: UsersIcon, title: t.expertConsultation, description: t.expertConsultationDesc },
    { icon: ShieldCheckIcon, title: t.lifetimeWarranty, description: t.lifetimeWarrantyDesc },
    { icon: LeafIcon, title: t.ecoFriendly, description: t.ecoFriendlyDesc },
    { icon: ClockIcon, title: t.fastDelivery, description: t.fastDeliveryDesc },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SEO
        title={seoSettings?.defaultTitle}
        description={seoSettings?.defaultDescription}
        keywords={seoSettings?.defaultKeywords}
        ogImage={seoSettings?.ogImage}
        canonicalUrl={window.location.origin}
        structuredData={structuredData}
      />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.15), transparent 50%)",
            y,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <Header />
      
      {/* Hero Section - Compact & Modern */}
      <section ref={heroRef} className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* 3D Yacht Background Image */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562281302-809108fd533c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            scale,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        </motion.div>
        
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12"
          style={{ opacity }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 via-blue-500/15 to-cyan-500/15 backdrop-blur-md border border-primary/20 mb-8 shadow-lg shadow-primary/5"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <SparklesIcon className="h-3.5 w-3.5 text-primary" />
              </motion.div>
              <span className="text-xs font-semibold bg-gradient-to-r from-primary via-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-wide uppercase">
                {t.premiumMarineLifestyle}
              </span>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-cyan-500"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-balance mb-6 leading-tight tracking-tight"
            >
              {t.heroTitle}{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary/90 via-blue-500/90 to-cyan-500/90 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground/90 mb-8 text-balance max-w-2xl mx-auto font-normal leading-relaxed"
            >
              {t.heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <Link to="/products">
                <Button size="lg" className="px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  {t.exploreCollection}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>


          </div>
        </motion.div>
        
        {/* Simplified scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-1.5 backdrop-blur-sm bg-background/20">
            <motion.div
              className="w-1.5 h-2 rounded-full bg-primary"
              animate={{ y: [0, 15, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Subtle bottom decoration */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1758671625125-6a1a876e6ae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
            }}
          />
        </motion.div>
      </section>

      {/* Features with 3D cards */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
                    
                    <div className="relative z-10 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 shadow-lg group-hover:shadow-primary/20"
                      >
                        <Icon className="h-10 w-10 text-primary" />
                      </motion.div>
                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    
                    {/* Corner decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-50" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories with 3D depth */}
      {categories && categories.length > 0 && (
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {t.shopByCategory}
                </span>
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">{t.discoverCurated}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {categories.slice(0, 4).map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -12, rotateY: 5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link to={`/products?category=${category._id}`} className="block group">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-accent/20 border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                      <div className="aspect-square relative overflow-hidden">
                        {category.imageUrl ? (
                          <>
                            <motion.img
                              src={category.imageUrl}
                              alt={category.name}
                              className="object-cover w-full h-full"
                              whileHover={{ scale: 1.15 }}
                              transition={{ duration: 0.6 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                            <motion.span
                              className="text-7xl font-bold text-primary/40"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {category.name[0]}
                            </motion.span>
                          </div>
                        )}
                        
                        {/* Shine effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm">
                        <motion.h3
                          className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          {category.name}
                        </motion.h3>
                        <motion.div
                          className="flex items-center text-sm text-primary"
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span>{t.explore}</span>
                          <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                {t.featuredCollection}
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.featuredDescription}
            </p>
          </motion.div>
          
          {!featuredProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[500px] w-full rounded-3xl" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">{t.noFeaturedProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link to="/products">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" className="text-base px-10 py-7 rounded-2xl border-2 backdrop-blur-sm bg-background/50 hover:bg-background/80 hover:border-primary/50 transition-all duration-300">
                  {t.viewAllProducts}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="py-16 bg-gradient-to-b from-background to-accent/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
              {t.trustedBrands}
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t.trustedBrandsDesc}
            </p>
          </motion.div>

          {!brands ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No brands to display yet.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12"
            >
              {brands.map((brand, index) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex items-center justify-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300"
                >
                  {brand.websiteUrl ? (
                    <a
                      href={brand.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-xl font-bold text-foreground/70">${brand.name}</span>`;
                          }
                        }}
                      />
                    </a>
                  ) : (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xl font-bold text-foreground/70">${brand.name}</span>`;
                        }
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Interactive 3D Product Showcase */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
          <motion.div
            className="absolute top-[20%] left-[10%] w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.3, 0.5, 0.3],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-6">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary tracking-wide">INTERACTIVE SHOWCASE</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Platforms & Water Toys
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our handpicked collection of floating platforms, docks, and premium water sports equipment
            </p>
          </motion.div>

          {/* 3D Product Grid */}
          {!premiumCollectionProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[500px] w-full rounded-3xl" />
              ))}
            </div>
          ) : premiumCollectionProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No platform or water toy products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {premiumCollectionProducts.slice(0, 6).map((product, index) => (
                <Interactive3DProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-20"
          >
            <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-blue-500/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm relative overflow-hidden">
              {/* Animated Background Elements */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <div className="relative z-10">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                  Explore Our Complete Collection
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Browse marine electronics, navigation systems, and all premium marine equipment
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-base">
                        Browse All Products
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/contact">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="outline" className="px-10 py-6 rounded-xl border-2 hover:bg-accent/50 transition-all text-base">
                        Contact Expert
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <Testimonials />

      {/* CTA Section - Centered with Stunning Yacht Design */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* 3D Yacht Background with Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: useTransform(scrollYProgress, [0.7, 1], ["0%", "30%"]) }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1758671625125-6a1a876e6ae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/98 via-blue-600/95 to-cyan-600/90" />
          
          {/* Animated overlay pattern */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 100%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Floating yacht decoration */}
        <motion.div
          className="absolute top-[15%] left-[5%] w-[400px] h-[250px] opacity-10 hidden lg:block rounded-3xl shadow-2xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541599955-d89bfc188927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-[10%] right-[5%] w-[400px] h-[250px] opacity-10 hidden lg:block rounded-3xl shadow-2xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562281302-809108fd533c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          animate={{
            y: [0, 30, 0],
            rotate: [5, -5, 5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Content - Perfectly Centered */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8 shadow-2xl"
            >
              <ShipIcon className="h-4 w-4 text-white" />
              <span className="text-xs font-bold text-white tracking-wider">{t.exclusiveCollection}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white tracking-tight drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t.ctaTitle}
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                {t.ctaTitleHighlight}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/95 mb-10 max-w-3xl leading-relaxed font-light drop-shadow-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {t.ctaDescription}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link to="/products">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button 
                    size="lg" 
                    className="text-base px-10 py-6 rounded-xl shadow-2xl hover:shadow-white/30 transition-all duration-500 font-bold bg-white text-primary hover:bg-white/90 border-2 border-white/50"
                  >
                    {t.shopCollection}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-10 text-white/90 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span className="font-semibold">{t.secureCheckout}</span>
              </div>
              <div className="flex items-center gap-2">
                <AwardIcon className="h-4 w-4" />
                <span className="font-semibold">{t.premiumQuality}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShipIcon className="h-4 w-4" />
                <span className="font-semibold">{t.freeShipping}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom wave decoration */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          <WavesIcon className="w-full h-full text-white" />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
