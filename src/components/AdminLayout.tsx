import type { ReactNode } from "react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { 
  LayoutDashboardIcon,
  PackageIcon,
  FolderIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
    { path: "/admin/products", label: "Ürünler", icon: PackageIcon },
    { path: "/admin/categories", label: "Kategoriler", icon: FolderIcon },
    { path: "/admin/orders", label: "Siparişler", icon: ShoppingCartIcon },
    { path: "/admin/shipping", label: "Kargo", icon: TruckIcon },
    { path: "/admin/users", label: "Kullanıcılar", icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 border-r bg-muted/30">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
