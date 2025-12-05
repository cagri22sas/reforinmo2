import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";

export default function RemoveYachtbeachPage() {
  const runRemoval = useAction(api.runRemoveYachtbeach.run);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ updateCount: number; message: string } | null>(null);

  const handleRun = async () => {
    if (!confirm("Are you sure you want to remove 'YACHTBEACH' from all product names?")) {
      return;
    }

    setIsRunning(true);
    try {
      const res = await runRemoval({});
      setResult(res);
      toast.success(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update products");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Remove YACHTBEACH from Product Names</h1>
          <p className="text-muted-foreground">
            This tool will remove "YACHTBEACH" from all product names and update their slugs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Update Products</CardTitle>
            <CardDescription>
              This will update all products that contain "YACHTBEACH" in their name
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {result.message}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Successfully updated {result.updateCount} products
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900 dark:text-orange-100">
                      Warning
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      This action will modify product names and slugs. Make sure you have a backup.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleRun}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? "Updating..." : "Remove YACHTBEACH from Products"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
