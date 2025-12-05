import type { ReactNode } from "react";
import { useState } from "react";
import Header from "@/components/Header.tsx";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
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
  MessageCircleIcon,
  TagIcon,
  FileTextIcon,
  StarIcon,
  MenuIcon
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navSections = [
    {
      label: "Main",
      items: [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
      ]
    },
    {
      label: "Catalog",
      items: [
        { path: "/admin/products", label: "Products", icon: PackageIcon },
        { path: "/admin/categories", label: "Categories", icon: FolderIcon },
        { path: "/admin/reviews", label: "Reviews", icon: StarIcon },
        { path: "/admin/media", label: "Media", icon: ImageIcon },
      ]
    },
    {
      label: "Content",
      items: [
        { path: "/admin/pages", label: "Pages", icon: FileTextIcon },
      ]
    },
    {
      label: "Sales",
      items: [
        { path: "/admin/orders", label: "Orders", icon: ShoppingCartIcon },
        { path: "/admin/coupons", label: "Coupons", icon: TagIcon },
        { path: "/admin/shipping", label: "Shipping", icon: TruckIcon },
        { path: "/admin/stripe-dashboard", label: "Analytics", icon: BarChart3Icon },
      ]
    },
    {
      label: "Engage",
      items: [
        { path: "/admin/chat", label: "Live Chat", icon: MessageCircleIcon },
      ]
    },
    {
      label: "Configuration",
      items: [
        { path: "/admin/users", label: "Users", icon: UsersIcon },
        { path: "/admin/seo", label: "SEO", icon: SearchIcon },
        { path: "/admin/site-config", label: "Site Config", icon: GlobeIcon },
        { path: "/admin/stripe-config", label: "Payments", icon: CreditCardIcon },
        { path: "/admin/migrate-images", label: "Migrate Images", icon: ImageIcon },
        { path: "/admin/settings", label: "Settings", icon: SettingsIcon },
      ]
    },
  ];

  // Sidebar content component for reuse
  const SidebarContent = () => (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Sidebar Header with Gradient Accent */}
      <div className="p-6 border-b relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
            <LayoutDashboardIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground">Management Center</p>
          </div>
        </div>
      </div>

      {/* Navigation with Smooth Scrolling */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1.5">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
              {section.label}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-[1.02]"
                        : "hover:bg-muted/60 hover:scale-[1.01]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                      <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
                    </div>
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer with Status */}
      <div className="p-4 border-t bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-card/50">
          <span className="text-sm font-medium text-muted-foreground">System Status</span>
          <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 shadow-sm">
            <span className="mr-1.5 animate-pulse">●</span> Active
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/20 via-background to-muted/10">
      <Header />
      
      <div className="flex-1 flex">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <aside className="hidden lg:flex w-72 border-r bg-gradient-to-b from-card to-card/95 shadow-lg backdrop-blur-sm flex-col sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar - Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-card to-card/95">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content Area with Padding */}
        <main className="flex-1 overflow-x-hidden bg-gradient-to-br from-background via-muted/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
