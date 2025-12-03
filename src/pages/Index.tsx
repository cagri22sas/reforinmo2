import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import ProductCard from "@/components/ProductCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ShipIcon, ShieldCheckIcon, SparklesIcon, AwardIcon, WavesIcon } from "lucide-react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

export default function Index() {
  const featuredProducts = useQuery(api.products.list, { featured: true });
  const categories = useQuery(api.categories.list, {});
  const seoSettings = useQuery(api.admin.seoSettings.get);
  
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
    { icon: ShipIcon, title: "Free Shipping", description: "On all orders over €500" },
    { icon: ShieldCheckIcon, title: "Secure Checkout", description: "Powered by Stripe" },
    { icon: AwardIcon, title: "Premium Quality", description: "Handcrafted excellence" },
    { icon: SparklesIcon, title: "Luxury Design", description: "Elegant & timeless" },
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
      
      {/* Hero Section with 3D Yacht Design */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
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
        
        {/* 3D Floating yacht elements */}
        <motion.div
          className="absolute top-1/4 right-[10%] w-[500px] h-[300px] opacity-20 rounded-3xl shadow-2xl"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541599955-d89bfc188927?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            rotateY: useTransform(smoothMouseX, [-20, 20], [-15, 15]),
            rotateX: useTransform(smoothMouseY, [-20, 20], [15, -15]),
            transformStyle: "preserve-3d",
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20"
          style={{ opacity }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 backdrop-blur-md border border-primary/30 mb-6 shadow-xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <SparklesIcon className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-xs font-bold text-primary tracking-wide">PREMIUM MARINE LIFESTYLE</span>
            </motion.div>

            <motion.div
              style={{ 
                rotateX: useTransform(smoothMouseY, [-20, 20], [3, -3]),
                rotateY: useTransform(smoothMouseX, [-20, 20], [-3, 3]),
                transformStyle: "preserve-3d",
              }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance mb-6 leading-tight tracking-tight"
              >
                Where Luxury{" "}
                <br className="hidden sm:block" />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl">
                    Meets the Sea
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1 }}
                  />
                </span>
              </motion.h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg lg:text-xl text-foreground/80 mb-8 text-balance max-w-3xl mx-auto leading-relaxed font-light"
            >
              Experience the ultimate in floating luxury with our handcrafted marine platforms and accessories
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link to="/products">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="group text-base px-8 py-6 rounded-xl shadow-2xl hover:shadow-primary/40 transition-all duration-300 bg-gradient-to-r from-primary via-blue-600 to-primary hover:from-blue-600 hover:to-primary border-2 border-primary/20">
                    Explore Collection
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/products">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-2 backdrop-blur-md bg-background/60 hover:bg-background/90 hover:border-primary transition-all duration-300">
                    View Catalog
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 3D Animated scroll indicator */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-14 rounded-full border-2 border-primary/60 flex items-start justify-center p-2 backdrop-blur-sm bg-background/20 shadow-xl">
            <motion.div
              className="w-2 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"
              animate={{ y: [0, 20, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Floating yacht decoration at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
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
      <section className="py-32 relative">
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
        <section className="py-32 relative">
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
                  Shop by Category
                </span>
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">Discover our curated collections</p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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
                          <span>Explore</span>
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
      <section className="py-32 relative">
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
                Featured Collection
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Handpicked luxury pieces for the discerning water enthusiast
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
              <p className="text-lg text-muted-foreground">No featured products available yet.</p>
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
                  View All Products
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Centered with Stunning Yacht Design */}
      <section className="py-32 lg:py-48 relative overflow-hidden">
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
              <span className="text-xs font-bold text-white tracking-wider">EXCLUSIVE COLLECTION</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white tracking-tight drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Begin Your
              <br />
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Journey
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
              Transform your aquatic experience with our exclusive collection of premium floating platforms
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
                    Shop Collection
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
              className="flex items-center gap-6 mt-10 text-white/90 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4" />
                <span className="font-semibold">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <AwardIcon className="h-4 w-4" />
                <span className="font-semibold">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <ShipIcon className="h-4 w-4" />
                <span className="font-semibold">Free Shipping</span>
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
