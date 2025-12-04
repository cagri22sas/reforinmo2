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
  FolderIcon,
  TruckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout.tsx";
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
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You must have admin privileges to access this page.
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

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
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
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      subtitle: `Last 30 days: ${formatPrice(stats.recentRevenue)}`,
      trend: stats.revenueTrend,
      icon: DollarSignIcon,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Last 30 Days Orders",
      value: stats.recentOrders.toString(),
      subtitle: `Total: ${stats.totalOrders}`,
      trend: stats.ordersTrend,
      icon: ShoppingCartIcon,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      link: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      subtitle: "Awaiting processing",
      icon: PackageIcon,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      link: "/admin/orders",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      subtitle: `${stats.totalProducts} products`,
      icon: UsersIcon,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      link: "/admin/users",
    },
  ];

  // Prepare order status data for chart
  const statusData = [
    { name: "Pending", value: chartData.statusCounts.pending, fill: "#f59e0b" },
    { name: "Processing", value: chartData.statusCounts.processing, fill: "#3b82f6" },
    { name: "Shipped", value: chartData.statusCounts.shipped, fill: "#8b5cf6" },
    { name: "Delivered", value: chartData.statusCounts.delivered, fill: "#10b981" },
    { name: "Cancelled", value: chartData.statusCounts.cancelled, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header with Gradient */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your e-commerce performance and metrics
          </p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Stats - Enhanced Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <Card className={`${stat.link ? 'hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] hover:-translate-y-1' : ''} relative overflow-hidden group`}>
              {/* Gradient Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl shadow-md ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 relative z-10">
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">{stat.subtitle}</p>
                  {stat.trend !== undefined && formatTrend(stat.trend)}
                </div>
              </CardContent>
              
              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.iconBg}`} />
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

      {/* Charts Row - Enhanced */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Revenue Trend</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </div>
            </div>
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
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Legend 
                  formatter={(value: string) => value === 'revenue' ? 'Revenue (€)' : 'Order Count'}
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
        <Card className="border-t-4 border-t-accent shadow-sm hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <PackageIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Order Status</CardTitle>
                <CardDescription>Current distribution</CardDescription>
              </div>
            </div>
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
                  formatter={(value: number) => [`${value} orders`, 'Total']}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards - Enhanced */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full" />
          Quick Access
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/products">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05] hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                    <PackageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Products</p>
                    <p className="text-sm text-muted-foreground">{stats.totalProducts} total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05] hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                    <FolderIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Categories</p>
                    <p className="text-sm text-muted-foreground">Organize</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05] hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                    <ShoppingCartIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Orders</p>
                    <p className="text-sm text-muted-foreground">{stats.pendingOrders} pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/shipping">
            <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.05] hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                    <TruckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Shipping</p>
                    <p className="text-sm text-muted-foreground">Configure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Alert for Low Stock - Enhanced */}
      {stats.lowStockProducts > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <AlertTriangleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">⚠️ Low Stock Alert</p>
                <p className="text-sm text-muted-foreground">
                  {stats.lowStockProducts} product{stats.lowStockProducts > 1 ? 's' : ''} running low on inventory.
                  <Link to="/admin/products" className="ml-2 text-primary underline hover:text-primary/80 font-medium transition-colors">
                    Review now →
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
    <>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertTriangleIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-bold">Authentication Required</h2>
                <p className="text-muted-foreground">
                  You must be signed in to access the admin panel
                </p>
                <SignInButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>

      <AuthLoading>
        <AdminLayout>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </AdminLayout>
      </AuthLoading>

      <Authenticated>
        <AdminLayout>
          <AdminDashboardContent />
        </AdminLayout>
      </Authenticated>
    </>
  );
}
