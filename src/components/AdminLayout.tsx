import type { ReactNode } from "react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { 
  LayoutDashboardIcon,
  PackageIcon,
  FolderIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  SettingsIcon,
  GlobeIcon,
  ImageIcon,
  CreditCardIcon,
  SearchIcon,
  BarChart3Icon,
  ChevronRightIcon,
  MessageCircleIcon,
  TagIcon
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navSections = [
    {
      label: "Main Menu",
      items: [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
      ]
    },
    {
      label: "Product Management",
      items: [
        { path: "/admin/products", label: "Products", icon: PackageIcon },
        { path: "/admin/categories", label: "Categories", icon: FolderIcon },
        { path: "/admin/media", label: "Media Library", icon: ImageIcon },
      ]
    },
    {
      label: "Sales",
      items: [
        { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
        { path: "/admin/coupons", label: "Coupons", icon: TagIcon },
        { path: "/admin/shipping", label: "Shipping Settings", icon: TruckIcon },
        { path: "/admin/stripe-dashboard", label: "Stripe Dashboard", icon: BarChart3Icon },
      ]
    },
    {
      label: "Support",
      items: [
        { path: "/admin/chat", label: "Live Chat", icon: MessageCircleIcon },
      ]
    },
    {
      label: "Site Settings",
      items: [
        { path: "/admin/users", label: "Users", icon: UsersIcon },
        { path: "/admin/seo", label: "SEO Settings", icon: SearchIcon },
        { path: "/admin/site-config", label: "Site Configuration", icon: GlobeIcon },
        { path: "/admin/stripe-config", label: "Payment Settings", icon: CreditCardIcon },
        { path: "/admin/settings", label: "General Settings", icon: SettingsIcon },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      
      <div className="flex-1 flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 border-r bg-card shadow-sm flex flex-col">
          <div className="flex-1 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <LayoutDashboardIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Admin Panel</h2>
                  <p className="text-xs text-muted-foreground">Management Center</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              {navSections.map((section) => (
                <div key={section.label} className="space-y-2">
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.label}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-muted/80"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn(
                              "h-5 w-5 transition-transform group-hover:scale-110",
                              isActive ? "text-primary-foreground" : "text-muted-foreground"
                            )} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default" className="bg-green-500">
                  <span className="mr-1">●</span> Online
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
