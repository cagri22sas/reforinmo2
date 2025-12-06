import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon, MenuIcon, UserIcon, PackageIcon, WavesIcon, Heart, Languages, X, ChevronDown, Anchor, Radio, Compass, LifeBuoy, Gauge, Wrench, Ship, Waves, Store, Mail, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import type { Id } from "@/convex/_generated/dataModel.d.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { useLanguage, translations } from "@/hooks/use-language.ts";
import { useState, useEffect } from "react";

type SiteConfigWithUrls = {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footerText: string;
  logoUrl: string | null;
  faviconUrl: string | null;
};

// Category icon mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("electronic") || name.includes("elektro")) return Radio;
  if (name.includes("navigation") || name.includes("navigasyon")) return Compass;
  if (name.includes("safety") || name.includes("güvenlik")) return LifeBuoy;
  if (name.includes("communication") || name.includes("iletişim")) return Radio;
  if (name.includes("instrument") || name.includes("enstrüman")) return Gauge;
  if (name.includes("maintenance") || name.includes("bakım")) return Wrench;
  if (name.includes("water sport") || name.includes("su sporları")) return Waves;
  if (name.includes("dock") || name.includes("platform")) return Ship;
  if (name.includes("accessori") || name.includes("aksesuar")) return PackageIcon;
  return Anchor; // default icon
};

export default function Header() {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const categories = useQuery(api.categories.listWithProducts, {});
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const isAdmin = useQuery(api.users.isAdmin, {});
  const siteConfig = useQuery(api.admin.siteConfig.get, {}) as SiteConfigWithUrls | null | undefined;
  const { signoutRedirect } = useAuth();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Generate or retrieve session ID for guest users
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Guest session is now created by useGuestSession hook with UUID
    const id = localStorage.getItem("guestSessionId");
    setSessionId(id);
  }, []);
  
  // Get cart count for both authenticated and guest users
  const cartCount = useQuery(
    api.cart.getCount, 
    sessionId ? { sessionId } : "skip"
  );

  // Get wishlist count for authenticated users
  const wishlistCount = useQuery(api.wishlist.getWishlistCount, {});

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo with 3D Marine Design */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group relative flex-shrink-0">
            {siteConfig && 'logoUrl' in siteConfig && siteConfig.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.siteName}
                className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                {/* 3D Marine Icon with Multiple Layers */}
                <div className="relative">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl sm:rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                  
                  {/* Main icon container */}
                  <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    {/* Layered marine elements */}
                    <div className="relative">
                      {/* Background waves */}
                      <WavesIcon className="absolute inset-0 h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground/20 translate-y-1 sm:translate-y-2 translate-x-0.5 sm:translate-x-1" />
                      {/* Main anchor icon */}
                      <svg className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3"/>
                        <line x1="12" y1="22" x2="12" y2="8"/>
                        <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                      </svg>
                    </div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full shadow-lg" />
                  </div>
                </div>
                
                {/* Brand text with gradient */}
                <div className="flex flex-col">
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight leading-none group-hover:tracking-wide transition-all duration-300">
                    {siteConfig?.siteName || "Marine Store"}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-muted-foreground/80 tracking-widest uppercase font-medium hidden sm:block">
                    {t.marineExcellence}
                  </div>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Shop Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Button 
                variant="ghost" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {language === "es" ? "Tienda" : "Shop"}
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Mega Menu Dropdown */}
              {showMegaMenu && (
                <div className="absolute left-0 top-full pt-2 z-50 w-screen max-w-3xl -translate-x-1/4">
                  <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8">
                    <div className="grid grid-cols-3 gap-6">
                      {/* All Products Card */}
                      <Link
                        to="/products"
                        onClick={() => setShowMegaMenu(false)}
                        className="group flex flex-col gap-3 p-4 rounded-xl hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <PackageIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {t.allProducts}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === "es" ? "Ver todos los productos" : "View all products"}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Categories */}
                      {categories?.map((category) => {
                        const Icon = getCategoryIcon(category.name);
                        return (
                          <Link
                            key={category._id}
                            to={`/products?category=${category._id}`}
                            onClick={() => setShowMegaMenu(false)}
                            className="group flex flex-col gap-3 p-4 rounded-xl hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                                  {category.name}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link to="/about">
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
                <Info className="h-4 w-4 mr-1.5" />
                {language === "es" ? "Sobre Nosotros" : "About Us"}
              </Button>
            </Link>

            {/* Dealers (Store Locator) */}
            <Link to="/stores">
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
                <Store className="h-4 w-4 mr-1.5" />
                {language === "es" ? "Distribuidores" : "Dealers"}
              </Button>
            </Link>

            {/* Contact */}
            <Link to="/contact">
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
                <Mail className="h-4 w-4 mr-1.5" />
                {language === "es" ? "Contacto" : "Contact"}
              </Button>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <Authenticated>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
                  <Heart className="h-5 w-5" />
                  {wishlistCount !== undefined && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-in zoom-in-50">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>
            </Authenticated>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount !== undefined && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-in zoom-in-50">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <Languages className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 shadow-xl border-border/50">
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className={`cursor-pointer ${language === "en" ? "bg-primary/10 font-semibold" : ""}`}
                >
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("es")}
                  className={`cursor-pointer ${language === "es" ? "bg-primary/10 font-semibold" : ""}`}
                >
                  🇪🇸 Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Authenticated>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                    {t.admin}
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-xl border-border/50">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{currentUser?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <PackageIcon className="h-4 w-4 mr-2" />
                      {t.myOrders}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {t.myProfile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" />
                      {t.myWishlist}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signoutRedirect()} className="cursor-pointer text-destructive focus:text-destructive">
                    {t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Authenticated>
            <Unauthenticated>
              <SignInButton className="hidden sm:inline-flex" />
            </Unauthenticated>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 transition-all">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[380px] p-0 flex flex-col">
                {/* Header with Gradient - Sticky */}
                <div className="sticky top-0 z-10 bg-gradient-to-br from-primary/10 via-accent/5 to-background p-6 pb-8 border-b border-border/50 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-50" />
                        <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
                          <MenuIcon className="h-5 w-5 text-primary-foreground" />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t.menu || "Menu"}
                      </h2>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* User Info Card - Only for Authenticated */}
                  <Authenticated>
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-sm opacity-30" />
                          <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-2.5 rounded-full border border-primary/20">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{currentUser?.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                        </div>
                      </div>
                    </div>
                  </Authenticated>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">

                {/* Navigation Section */}
                <div className="p-6 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    {language === "es" ? "Tienda" : "Shop"}
                  </p>
                  
                  <Link 
                    to="/products" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <PackageIcon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-base">{t.allProducts}</span>
                  </Link>
                  
                  {categories?.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    return (
                      <Link
                        key={category._id}
                        to={`/products?category=${category._id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-colors group"
                      >
                        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Additional Pages */}
                <div className="px-6 pb-6 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                    {language === "es" ? "Información" : "Information"}
                  </p>
                  
                  <Link 
                    to="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{language === "es" ? "Sobre Nosotros" : "About Us"}</span>
                  </Link>

                  <Link 
                    to="/stores" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{language === "es" ? "Distribuidores" : "Dealers"}</span>
                  </Link>

                  <Link 
                    to="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{language === "es" ? "Contacto" : "Contact"}</span>
                  </Link>
                </div>

                {/* User Actions */}
                <Authenticated>
                  <div className="px-6 pb-6 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                      {t.myAccount || "My Account"}
                    </p>
                    
                    <Link 
                      to="/orders" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <PackageIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{t.myOrders}</span>
                    </Link>
                    
                    <Link 
                      to="/wishlist" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{t.myWishlist}</span>
                        {wishlistCount !== undefined && wishlistCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 font-bold">
                            {wishlistCount}
                          </span>
                        )}
                      </div>
                    </Link>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{t.myProfile}</span>
                    </Link>
                    
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent/10 transition-colors group border border-accent/20"
                      >
                        <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium text-sm">{t.admin}</span>
                      </Link>
                    )}
                  </div>
                </Authenticated>

                {/* Sign In / Sign Out Section */}
                <div className="px-6 pb-6 space-y-3">
                  <Unauthenticated>
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20 mb-6">
                      <p className="text-sm text-muted-foreground mb-3">{t.signInPrompt || "Sign in to unlock all features"}</p>
                      <SignInButton className="w-full" />
                    </div>
                  </Unauthenticated>
                  
                  <Authenticated>
                    <Button
                      variant="outline"
                      onClick={() => {
                        signoutRedirect();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full h-11 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/30 mb-6"
                    >
                      {t.signOut}
                    </Button>
                  </Authenticated>
                  
                  {/* Language Selector */}
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                    {language === 'en' ? 'Language' : 'Idioma'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={language === "en" ? "default" : "outline"}
                      onClick={() => {
                        setLanguage("en");
                      }}
                      className="h-11"
                    >
                      <span className="mr-2">🇬🇧</span>
                      English
                    </Button>
                    <Button
                      variant={language === "es" ? "default" : "outline"}
                      onClick={() => {
                        setLanguage("es");
                      }}
                      className="h-11"
                    >
                      <span className="mr-2">🇪🇸</span>
                      Español
                    </Button>
                  </div>
                </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
