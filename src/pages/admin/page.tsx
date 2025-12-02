import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Link } from "react-router-dom";
import { 
  PackageIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  DollarSignIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  FolderIcon,
  TruckIcon
} from "lucide-react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";

function AdminDashboardContent() {
  const stats = useQuery(api.admin.orders.getStats, {});
  const isAdmin = useQuery(api.users.isAdmin, {});

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Erişim Reddedildi</h2>
            <p className="text-muted-foreground">
              Bu sayfaya erişim için admin yetkisine sahip olmalısınız.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (stats === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `${price.toFixed(2)} TL`;

  const statCards = [
    {
      title: "Toplam Gelir",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSignIcon,
      color: "text-green-600",
    },
    {
      title: "Toplam Sipariş",
      value: stats.totalOrders.toString(),
      icon: ShoppingCartIcon,
      color: "text-blue-600",
      link: "/admin/orders",
    },
    {
      title: "Bekleyen Siparişler",
      value: stats.pendingOrders.toString(),
      icon: PackageIcon,
      color: "text-orange-600",
      link: "/admin/orders",
    },
    {
      title: "Toplam Müşteri",
      value: stats.totalCustomers.toString(),
      icon: UsersIcon,
      color: "text-purple-600",
      link: "/admin/users",
    },
  ];

  const quickStats = [
    {
      title: "Toplam Ürün",
      value: stats.totalProducts.toString(),
      icon: FolderIcon,
      link: "/admin/products",
    },
    {
      title: "Düşük Stok",
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangleIcon,
      link: "/admin/products",
    },
    {
      title: "Son 30 Gün",
      value: `${stats.recentOrders} Sipariş`,
      icon: TrendingUpIcon,
      link: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
        <p className="text-muted-foreground">
          E-ticaret sitenizi yönetin ve istatistikleri görüntüleyin
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <Card className={stat.link ? "hover:shadow-lg transition-shadow cursor-pointer" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );

          return stat.link ? (
            <Link key={stat.title} to={stat.link}>
              {content}
            </Link>
          ) : (
            <div key={stat.title}>{content}</div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-bold mb-4">Hızlı İstatistikler</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold mb-4">Yönetim</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PackageIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-semibold">Ürünler</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FolderIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="font-semibold">Kategoriler</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <ShoppingCartIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="font-semibold">Siparişler</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/shipping">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TruckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="font-semibold">Kargo</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Unauthenticated>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Admin paneline erişmek için giriş yapmalısınız
                </p>
                <SignInButton />
              </div>
            </CardContent>
          </Card>
        </Unauthenticated>

        <AuthLoading>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </AuthLoading>

        <Authenticated>
          <AdminDashboardContent />
        </Authenticated>
      </div>

      <Footer />
    </div>
  );
}
