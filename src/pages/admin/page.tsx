import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
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
  TrendingDownIcon,
  FolderIcon,
  TruckIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

function AdminDashboardContent() {
  const stats = useQuery(api.admin.orders.getStats, {});
  const chartData = useQuery(api.admin.orders.getChartData, {});
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

  if (stats === undefined || chartData === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const formatPrice = (price: number) => `₺${price.toFixed(2)}`;
  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendIcon className="h-4 w-4" />
        <span>{Math.abs(trend).toFixed(1)}%</span>
      </div>
    );
  };

  const statCards = [
    {
      title: "Toplam Gelir",
      value: formatPrice(stats.totalRevenue),
      subtitle: `Son 30 gün: ${formatPrice(stats.recentRevenue)}`,
      trend: stats.revenueTrend,
      icon: DollarSignIcon,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Son 30 Gün Siparişler",
      value: stats.recentOrders.toString(),
      subtitle: `Toplam: ${stats.totalOrders}`,
      trend: stats.ordersTrend,
      icon: ShoppingCartIcon,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      link: "/admin/orders",
    },
    {
      title: "Bekleyen Siparişler",
      value: stats.pendingOrders.toString(),
      subtitle: "İşlem bekliyor",
      icon: PackageIcon,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      link: "/admin/orders",
    },
    {
      title: "Toplam Müşteri",
      value: stats.totalCustomers.toString(),
      subtitle: `${stats.totalProducts} ürün`,
      icon: UsersIcon,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      link: "/admin/users",
    },
  ];

  // Prepare order status data for chart
  const statusData = [
    { name: "Bekliyor", value: chartData.statusCounts.pending, fill: "#f59e0b" },
    { name: "İşleniyor", value: chartData.statusCounts.processing, fill: "#3b82f6" },
    { name: "Kargoda", value: chartData.statusCounts.shipped, fill: "#8b5cf6" },
    { name: "Teslim Edildi", value: chartData.statusCounts.delivered, fill: "#10b981" },
    { name: "İptal Edildi", value: chartData.statusCounts.cancelled, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            E-ticaret performansınızı takip edin
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <Card className={`${stat.link ? 'hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]' : ''} border-l-4 border-l-primary/50`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  {stat.trend !== undefined && formatTrend(stat.trend)}
                </div>
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

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Son 7 Gün Gelir Trendi</CardTitle>
            <CardDescription>Günlük gelir ve sipariş sayıları</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatPrice(value) : value,
                    name === 'revenue' ? 'Gelir' : 'Sipariş'
                  ]}
                />
                <Legend 
                  formatter={(value: string) => value === 'revenue' ? 'Gelir (TL)' : 'Sipariş Sayısı'}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(142 76% 36%)" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(142 76% 36%)', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Durumu Dağılımı</CardTitle>
            <CardDescription>Mevcut sipariş durumlarının özeti</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} sipariş`, 'Toplam']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">Hızlı Erişim</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/products">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <PackageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Ürünler</p>
                    <p className="text-sm text-muted-foreground">{stats.totalProducts} ürün</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FolderIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Kategoriler</p>
                    <p className="text-sm text-muted-foreground">Yönet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <ShoppingCartIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Siparişler</p>
                    <p className="text-sm text-muted-foreground">{stats.pendingOrders} bekliyor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/shipping">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TruckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Kargo</p>
                    <p className="text-sm text-muted-foreground">Ayarlar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Alert for Low Stock */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangleIcon className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-semibold">Düşük Stok Uyarısı</p>
                <p className="text-sm text-muted-foreground">
                  {stats.lowStockProducts} ürün stok seviyesi düşük. 
                  <Link to="/admin/products" className="ml-1 underline hover:text-primary">
                    Ürünleri görüntüle
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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
