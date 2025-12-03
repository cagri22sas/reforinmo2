import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  EditIcon,
  TrashIcon,
  PackageIcon,
} from "lucide-react";

function EditProfileDialog({ 
  currentUser, 
  onClose 
}: { 
  currentUser: {
    name?: string;
    email?: string;
    phone?: string;
  }; 
  onClose: () => void;
}) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [formData, setFormData] = useState({
    name: currentUser.name || "",
    phone: currentUser.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile({
        name: formData.name || undefined,
        phone: formData.phone || undefined,
      });
      toast.success("Profile updated");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Full Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={currentUser.email || ""} disabled />
        <p className="text-xs text-muted-foreground">
          Email address cannot be changed
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

function AddressDialog({ 
  address, 
  onClose 
}: { 
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }; 
  onClose: () => void;
}) {
  const updateAddress = useMutation(api.users.updateAddress);
  const [formData, setFormData] = useState({
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    zipCode: address?.zipCode || "",
    country: address?.country || "Turkey",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAddress(formData);
      toast.success("Address saved");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Street Address *</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="123 Main Street"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Istanbul"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Region *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Marmara"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code *</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="34000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

function ProfileContent() {
  const currentUser = useQuery(api.users.getCurrentUser, {});
  const stats = useQuery(api.users.getStats, {});
  const deleteAddress = useMutation(api.users.deleteAddress);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

  if (currentUser === undefined || stats === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser || !stats) {
    return null;
  }

  const handleDeleteAddress = async () => {
    if (confirm("Are you sure you want to delete your address?")) {
      try {
        await deleteAddress({});
        toast.success("Address deleted");
      } catch (error) {
        toast.error("Could not delete address");
      }
    }
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentUser.name || "User"}</CardTitle>
                <p className="text-muted-foreground">{currentUser.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since: {formatDate(stats.memberSince)}
                </p>
              </div>
            </div>

            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile Information</DialogTitle>
                </DialogHeader>
                <EditProfileDialog
                  currentUser={currentUser}
                  onClose={() => setIsEditProfileOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                <PackageIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{stats.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <UserIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Full Name</Label>
              <p className="font-medium">{currentUser.name || "-"}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium">{currentUser.email || "-"}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm text-muted-foreground">Phone</Label>
              <p className="font-medium">{currentUser.phone || "-"}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <div className="mt-1">
                {currentUser.role === "admin" ? (
                  <Badge>Admin</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Default Address
              </CardTitle>

              <Dialog open={isEditAddressOpen} onOpenChange={setIsEditAddressOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <EditIcon className="h-4 w-4 mr-2" />
                    {currentUser.address ? "Edit" : "Add"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentUser.address ? "Edit Address" : "Add Address"}
                    </DialogTitle>
                  </DialogHeader>
                  <AddressDialog
                    address={currentUser.address}
                    onClose={() => setIsEditAddressOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {currentUser.address ? (
              <div className="space-y-2">
                <p className="font-medium">{currentUser.address.street}</p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.address.city}, {currentUser.address.state}{" "}
                  {currentUser.address.zipCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.address.country}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive mt-2"
                  onClick={handleDeleteAddress}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Address
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No address added yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <CardDescription>Your last 5 orders</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link key={order._id} to={`/orders/${order._id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order._creationTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "success"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {order.status === "pending"
                          ? "Pending"
                          : order.status === "processing"
                          ? "Processing"
                          : order.status === "shipped"
                          ? "Shipped"
                          : order.status === "delivered"
                          ? "Delivered"
                          : "Cancelled"}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and orders
          </p>
        </div>

        <Unauthenticated>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You must sign in to view your profile
                </p>
                <SignInButton />
              </div>
            </CardContent>
          </Card>
        </Unauthenticated>

        <AuthLoading>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </AuthLoading>

        <Authenticated>
          <ProfileContent />
        </Authenticated>
      </div>

      <Footer />
    </div>
  );
}
