import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon, MenuIcon, UserIcon, PackageIcon, WavesIcon } from "lucide-react";
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
import { useState, useEffect } from "react";

export default function Header() {
  const categories = useQuery(api.categories.list, {});
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const isAdmin = useQuery(api.users.isAdmin, {});
  const siteConfig = useQuery(api.admin.siteConfig.get, {});
  const { signoutRedirect } = useAuth();
  
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

  return (
    <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {siteConfig?.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.siteName}
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-2.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <WavesIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">
                  {siteConfig?.siteName || "YachtBeach"}
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
