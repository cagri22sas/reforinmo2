import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UpdateImages() {
  const batchUpdate = useMutation(api.updateImages.batchUpdateProductImages);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const result = await batchUpdate({});
      toast.success(`Successfully updated ${result.updated} products!`);
      setIsComplete(true);
    } catch (error) {
      toast.error("Failed to update product images");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Update Product Images</CardTitle>
            <CardDescription>
              This will update all product images with new high-quality yacht/marine equipment photos from Unsplash.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isComplete ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2Icon className="w-5 h-5" />
                <p>Product images have been successfully updated!</p>
              </div>
            ) : (
              <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                {isUpdating ? (
                  <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update All Product Images"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
