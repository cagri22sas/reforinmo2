import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon, MenuIcon, UserIcon, PackageIcon, WavesIcon, Heart, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { useLanguage } from "@/hooks/use-language.ts";
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

export default function Header() {
  const categories = useQuery(api.categories.listWithProducts, {});
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const isAdmin = useQuery(api.users.isAdmin, {});
  const siteConfig = useQuery(api.admin.siteConfig.get, {}) as SiteConfigWithUrls | null | undefined;
  const { signoutRedirect } = useAuth();
  const { language, setLanguage } = useLanguage();
  
  // Generate or retrieve session ID for guest users
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    let id = localStorage.getItem("guestSessionId");
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("guestSessionId", id);
    }
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
          <Link to="/" className="flex items-center space-x-3 group relative">
            {siteConfig && 'logoUrl' in siteConfig && siteConfig.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.siteName}
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                {/* 3D Marine Icon with Multiple Layers */}
                <div className="relative">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                  
                  {/* Main icon container */}
                  <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent p-3 rounded-3xl shadow-2xl group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                    {/* Layered marine elements */}
                    <div className="relative">
                      {/* Background waves */}
                      <WavesIcon className="absolute inset-0 h-7 w-7 text-primary-foreground/20 translate-y-2 translate-x-1" />
                      {/* Main anchor icon */}
                      <svg className="h-7 w-7 text-primary-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3"/>
                        <line x1="12" y1="22" x2="12" y2="8"/>
                        <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                      </svg>
                    </div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full shadow-lg" />
                  </div>
                </div>
                
                {/* Brand text with gradient */}
                <div className="flex flex-col">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight leading-none group-hover:tracking-wide transition-all duration-300">
                    {siteConfig?.siteName || "YachtBeach"}
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 tracking-widest uppercase font-medium">
                    Marine Excellence
                  </div>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/products">
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
                All Products
              </Button>
            </Link>
            {categories?.slice(0, 3).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
              >
                <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
                  {category.name}
                </Button>
              </Link>
            ))}
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
                    Admin
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
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserIcon className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="cursor-pointer">
                      <Heart className="h-4 w-4 mr-2" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signoutRedirect()} className="cursor-pointer text-destructive focus:text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Authenticated>
            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
