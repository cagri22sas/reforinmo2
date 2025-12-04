import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { 
  CheckCircle2Icon, 
  XCircleIcon, 
  ClockIcon,
  TrashIcon,
  AlertTriangleIcon,
  StarIcon,
  VerifiedIcon
} from "lucide-react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { toast } from "sonner";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

function ReviewsContent() {
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected" | undefined>("pending");
  const reviews = useQuery(api.admin.reviews.list, { status: selectedStatus });
  const stats = useQuery(api.admin.reviews.getStats, {});
  const isAdmin = useQuery(api.users.isAdmin, {});
  const approveReview = useMutation(api.admin.reviews.approve);
  const rejectReview = useMutation(api.admin.reviews.reject);
  const deleteReview = useMutation(api.admin.reviews.remove);

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

  const handleApprove = async (reviewId: Id<"reviews">) => {
    try {
      await approveReview({ reviewId });
      toast.success("Review approved successfully");
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (reviewId: Id<"reviews">) => {
    try {
      await rejectReview({ reviewId });
      toast.success("Review rejected");
    } catch (error) {
      toast.error("Failed to reject review");
    }
  };

  const handleDelete = async (reviewId: Id<"reviews">) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview({ reviewId });
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  if (reviews === undefined || stats === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Review Management</h1>
        <p className="text-muted-foreground">
          Moderate customer reviews and maintain quality standards
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <StarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" onValueChange={(value) => setSelectedStatus(value as typeof selectedStatus)}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {stats.pending > 0 && (
              <Badge variant="secondary" className="ml-2">{stats.pending}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <ClockIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No pending reviews</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                        {review.verifiedPurchase && (
                          <Badge variant="outline" className="gap-1">
                            <VerifiedIcon className="h-3 w-3" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-xl">{review.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      By {review.userName} • {new Date(review._creationTime).toLocaleDateString()}
                    </p>
                    <p className="leading-relaxed">{review.comment}</p>
                  </div>

                  {review.product && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium">{review.product.name}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleApprove(review._id)}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <CheckCircle2Icon className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(review._id)}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="ghost"
                      size="sm"
                      className="gap-2 ml-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <CheckCircle2Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No approved reviews</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2Icon className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-xl">{review.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      By {review.userName} • {new Date(review._creationTime).toLocaleDateString()}
                    </p>
                    <p className="leading-relaxed">{review.comment}</p>
                  </div>

                  {review.product && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium">{review.product.name}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleReject(review._id)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="ghost"
                      size="sm"
                      className="gap-2 ml-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <XCircleIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No rejected reviews</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <XCircleIcon className="h-3 w-3 mr-1" />
                        Rejected
                      </Badge>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <CardTitle className="text-xl">{review.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      By {review.userName} • {new Date(review._creationTime).toLocaleDateString()}
                    </p>
                    <p className="leading-relaxed">{review.comment}</p>
                  </div>

                  {review.product && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium">{review.product.name}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => handleApprove(review._id)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <CheckCircle2Icon className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="ghost"
                      size="sm"
                      className="gap-2 ml-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminReviews() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Unauthenticated>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You must be signed in to access the admin panel
                </p>
                <SignInButton />
              </div>
            </CardContent>
          </Card>
        </Unauthenticated>

        <AuthLoading>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </AuthLoading>

        <Authenticated>
          <ReviewsContent />
        </Authenticated>
      </div>

      <Footer />
    </div>
  );
}
