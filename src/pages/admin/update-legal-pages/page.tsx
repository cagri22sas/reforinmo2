import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout.tsx";

export default function UpdateLegalPagesPage() {
  const runUpdate = useAction(api.runUpdateLegalPages.run);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; updatedCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!confirm("Are you sure you want to update all legal pages? This will replace YachtBeach with Reforinmo Marine.")) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const updateResult = await runUpdate({});
      setResult(updateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Update Legal Pages</h1>
          <p className="text-muted-foreground">
            Update all legal pages to replace YachtBeach branding with Reforinmo Marine
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand Update Tool</CardTitle>
            <CardDescription>
              This tool will update all legal pages (Privacy, Terms, Imprint, Warranty) in both English and Spanish
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Changes that will be made:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>"YachtBeach" → "Reforinmo Marine"</li>
                <li>"YachtBeach International Ltd." → "Reforinmo Marine S.L."</li>
                <li>"@yachtbeach.com" → "@reforinmomarine.com"</li>
                <li>"yachtbeach.com" → "reforinmomarine.com"</li>
                <li>Phone: "+1 (555) 123-4567" → "+34 661 171 490"</li>
                <li>Address: "123 Harbor Street, Miami" → "CALLE URB LOS PINOS, NUM 16 PUERTA C, 03710 CALP"</li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleUpdate}
                disabled={isRunning}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Pages...
                  </>
                ) : (
                  "Update All Legal Pages"
                )}
              </Button>

              {result && (
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Success!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {result.message} - {result.updatedCount} page(s) updated
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-100">
                      Error
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Next steps:</strong> Visit the legal pages to verify the changes. You can view them at:
                  <br />• <a href="/privacy" className="underline hover:text-blue-700">/privacy</a>
                  <br />• <a href="/terms" className="underline hover:text-blue-700">/terms</a>
                  <br />• <a href="/imprint" className="underline hover:text-blue-700">/imprint</a>
                  <br />• <a href="/warranty" className="underline hover:text-blue-700">/warranty</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
