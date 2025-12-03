import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  PercentIcon,
  DollarSignIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

export default function AdminCouponsPage() {
  const coupons = useQuery(api.admin.coupons.list, {});
  const stats = useQuery(api.admin.coupons.getStats, {});
  const createCoupon = useMutation(api.admin.coupons.create);
  const updateCoupon = useMutation(api.admin.coupons.update);
  const removeCoupon = useMutation(api.admin.coupons.remove);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Id<"coupons"> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    description: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    expiresAt: "",
    active: true,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      description: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      expiresAt: "",
      active: true,
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: {
    _id: Id<"coupons">;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    description?: string;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    expiresAt?: number;
    active: boolean;
  }) => {
    setEditingCoupon(coupon._id);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      description: coupon.description || "",
      minOrderAmount: coupon.minOrderAmount?.toString() || "",
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      expiresAt: coupon.expiresAt
        ? format(new Date(coupon.expiresAt), "yyyy-MM-dd")
        : "",
      active: coupon.active,
    });
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        description: formData.description || undefined,
        minOrderAmount: formData.minOrderAmount
          ? parseFloat(formData.minOrderAmount)
          : undefined,
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : undefined,
        usageLimit: formData.usageLimit
          ? parseInt(formData.usageLimit)
          : undefined,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).getTime()
          : undefined,
        active: formData.active,
      };

      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon, ...data });
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(data);
        toast.success("Coupon created successfully");
      }

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"coupons">) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await removeCoupon({ id });
      toast.success("Coupon deleted successfully");
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Coupons</h1>
            <p className="text-muted-foreground mt-2">
              Manage discount codes and promotional coupons
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </DialogTitle>
                <DialogDescription>
                  {editingCoupon
                    ? "Update the coupon details below"
                    : "Add a new discount coupon for customers"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Coupon Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      placeholder="SAVE20"
                      required
                      className="uppercase"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Discount Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "percentage" | "fixed") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="value">
                    {formData.type === "percentage" ? "Percentage (%)" : "Amount (€)"} *
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.type === "percentage" ? "100" : undefined}
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder={formData.type === "percentage" ? "20" : "10.00"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="20% off on all products"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minOrderAmount">Min Order Amount (€)</Label>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, minOrderAmount: e.target.value })
                      }
                      placeholder="50.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxDiscountAmount">Max Discount (€)</Label>
                    <Input
                      id="maxDiscountAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxDiscountAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountAmount: e.target.value,
                        })
                      }
                      placeholder="100.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiresAt">Expires On</Label>
                    <Input
                      id="expiresAt"
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) =>
                        setFormData({ ...formData, expiresAt: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : editingCoupon
                        ? "Update"
                        : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-2">
                <TagIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Coupons</span>
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-2">
                <TagIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-muted-foreground">Active Coupons</span>
              </div>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-2">
                <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Usage</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalUsage}</p>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-card rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.map((coupon) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-mono font-semibold">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {coupon.type === "percentage" ? (
                        <PercentIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">{coupon.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : `€${coupon.value.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </TableCell>
                  <TableCell>
                    {coupon.expiresAt
                      ? format(new Date(coupon.expiresAt), "MMM dd, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {coupon.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(coupon)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(coupon._id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
