import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ShoppingCartIcon, MenuIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";

export default function Header() {
  const categories = useQuery(api.categories.list, {});
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const isAdmin = useQuery(api.users.isAdmin, {});
  const cartCount = useQuery(api.cart.getCount, {});

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              YachtBeach
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Tüm Ürünler
            </Link>
            {categories?.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Authenticated>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCartIcon className="h-5 w-5" />
                  {cartCount !== undefined && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </Link>
            </Authenticated>
            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            
            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
