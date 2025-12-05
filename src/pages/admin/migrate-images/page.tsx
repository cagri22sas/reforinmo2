import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { DownloadIcon, CheckCircle2Icon, XCircleIcon, AlertTriangleIcon, ImageIcon } from "lucide-react";

interface MigrationResults {
  productsProcessed: number;
  productImagesMigrated: number;
  categoriesProcessed: number;
  categoryImagesMigrated: number;
  errors: string[];
}

function MigrateImagesContent() {
  const migrateImages = useAction(api.migrateImagesToStorage.migrateAllImages);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResults | null>(null);

  const handleMigrate = async () => {
    if (!confirm("Tüm dış kaynaklı resimler Convex Storage'a taşınacak. Bu işlem uzun sürebilir. Devam etmek istiyor musunuz?")) {
      return;
    }

    setIsRunning(true);
    setResults(null);
    toast.info("Resim taşıma işlemi başlatıldı...");

    try {
      const migrationResults = await migrateImages({});
      setResults(migrationResults);
      
      if (migrationResults.errors.length === 0) {
        toast.success("Tüm resimler başarıyla taşındı!");
      } else {
        toast.warning("Bazı resimler taşınırken hata oluştu. Detaylar için aşağıya bakın.");
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Taşıma işlemi başarısız oldu");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resimleri Sunucuya Taşı</h1>
        <p className="text-muted-foreground mt-2">
          Tüm dış kaynaklı resimleri (Unsplash vb.) Convex Storage'a taşıyın
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Resim Taşıma İşlemi
          </CardTitle>
          <CardDescription>
            Bu işlem tüm ürün ve kategori resimlerini dış kaynaklardan Convex Storage'a taşır.
            İşlem sırasında her resim indirilip yeniden yüklenecektir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertTitle>Önemli Uyarı</AlertTitle>
            <AlertDescription>
              Bu işlem geri alınamaz ve uzun sürebilir. İşlem tamamlanana kadar sayfayı kapatmayın.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleMigrate} 
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            {isRunning ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Taşıma İşlemi Devam Ediyor...
              </>
            ) : (
              <>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Resimleri Taşımaya Başla
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                      Ürünler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.productImagesMigrated}</div>
                    <p className="text-xs text-muted-foreground">
                      {results.productsProcessed} üründen resim taşındı
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                      Kategoriler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{results.categoryImagesMigrated}</div>
                    <p className="text-xs text-muted-foreground">
                      {results.categoriesProcessed} kategoriden resim taşındı
                    </p>
                  </CardContent>
                </Card>
              </div>

              {results.errors.length > 0 && (
                <Alert variant="destructive">
                  <XCircleIcon className="h-4 w-4" />
                  <AlertTitle>Hatalar ({results.errors.length})</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                      {results.errors.map((error, index) => (
                        <div key={index} className="text-xs font-mono bg-background/50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {results.errors.length === 0 && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700 dark:text-green-300">Başarılı!</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    Tüm resimler başarıyla sunucuya taşındı. Artık tüm resimler Convex Storage'da tutuluyor.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminMigrateImagesPage() {
  return (
    <AdminLayout>
      <Unauthenticated>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Bu sayfaya erişmek için giriş yapmalısınız
              </p>
              <SignInButton />
            </div>
          </CardContent>
        </Card>
      </Unauthenticated>

      <AuthLoading>
        <Skeleton className="h-96 w-full" />
      </AuthLoading>

      <Authenticated>
        <MigrateImagesContent />
      </Authenticated>
    </AdminLayout>
  );
}
