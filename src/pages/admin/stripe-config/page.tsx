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
import { Switch } from "@/components/ui/switch.tsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { SaveIcon, CreditCardIcon, AlertTriangleIcon, CheckCircle2Icon, ExternalLinkIcon } from "lucide-react";

function StripeConfigContent() {
  const stripeConfig = useQuery(api.admin.stripeConfig.get, {});
  const updateConfig = useMutation(api.admin.stripeConfig.update);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    publishableKey: "",
    secretKey: "",
    webhookSecret: "",
    isTestMode: true,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  if (stripeConfig !== undefined && !isDataLoaded) {
    if (stripeConfig) {
      setFormData({
        publishableKey: stripeConfig.publishableKey || "",
        secretKey: stripeConfig.secretKey || "",
        webhookSecret: stripeConfig.webhookSecret || "",
        isTestMode: stripeConfig.isTestMode ?? true,
      });
    }
    setIsDataLoaded(true);
  }

  if (stripeConfig === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateConfig({
        publishableKey: formData.publishableKey,
        secretKey: formData.secretKey,
        webhookSecret: formData.webhookSecret || undefined,
        isTestMode: formData.isTestMode,
      });
      toast.success("Stripe ayarları kaydedildi");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bir hata oluştu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigured = stripeConfig !== null && stripeConfig.publishableKey && stripeConfig.secretKey;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stripe Yapılandırması</h1>
        <p className="text-muted-foreground">
          Ödeme sisteminizi yapılandırın ve yönetin
        </p>
      </div>

      {/* Status Alert */}
      <Alert variant={isConfigured ? "default" : "destructive"} className="border-2">
        {isConfigured ? (
          <>
            <CheckCircle2Icon className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Stripe Aktif</AlertTitle>
            <AlertDescription className="text-base">
              Ödeme sisteminiz yapılandırılmış ve çalışıyor. {formData.isTestMode ? "Test modunda" : "Canlı modda"} çalışıyorsunuz.
            </AlertDescription>
          </>
        ) : (
          <>
            <AlertTriangleIcon className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold">Stripe Yapılandırması Gerekli</AlertTitle>
            <AlertDescription className="text-base">
              Ödeme kabul etmek için Stripe API anahtarlarınızı aşağıya girmelisiniz.
            </AlertDescription>
          </>
        )}
      </Alert>

      {/* Instructions Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            API Anahtarlarınızı Nasıl Alırsınız?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Stripe Dashboard
                <ExternalLinkIcon className="h-3 w-3" />
              </a>
              {" "}adresine gidin ve giriş yapın
            </li>
            <li>Sağ üst köşeden "Developers" (Geliştiriciler) sekmesine tıklayın</li>
            <li>"API keys" (API anahtarları) bölümünü seçin</li>
            <li>Test veya canlı anahtarları kullanmak için mod değiştirin</li>
            <li>
              <strong>Publishable key</strong> (pk_test_... veya pk_live_...) ve{" "}
              <strong>Secret key</strong> (sk_test_... veya sk_live_...) anahtarlarını kopyalayın
            </li>
            <li>Anahtarları aşağıdaki forma yapıştırın</li>
          </ol>

          <Alert className="mt-4">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Güvenlik Notu:</strong> Secret key anahtarınızı asla kimseyle paylaşmayın veya kodunuza dahil etmeyin.
              Bu anahtarlar güvenli bir şekilde Hercules sunucularında saklanır.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>API Anahtarları</CardTitle>
            <CardDescription>
              Stripe hesabınızdaki API anahtarlarını girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-accent/50">
              <div className="space-y-0.5">
                <Label htmlFor="isTestMode" className="text-base font-semibold">
                  Test Modu
                </Label>
                <p className="text-sm text-muted-foreground">
                  Test modunda gerçek ödeme yapılmaz, sadece test edilir
                </p>
              </div>
              <Switch
                id="isTestMode"
                checked={formData.isTestMode}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isTestMode: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishableKey">
                Publishable Key {formData.isTestMode ? "(pk_test_...)" : "(pk_live_...)"}
              </Label>
              <Input
                id="publishableKey"
                type="text"
                value={formData.publishableKey}
                onChange={(e) =>
                  setFormData({ ...formData, publishableKey: e.target.value })
                }
                placeholder={formData.isTestMode ? "pk_test_..." : "pk_live_..."}
                required
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Bu anahtar frontend kodunda kullanılır ve herkes tarafından görülebilir
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">
                Secret Key {formData.isTestMode ? "(sk_test_...)" : "(sk_live_...)"}
              </Label>
              <Input
                id="secretKey"
                type="password"
                value={formData.secretKey}
                onChange={(e) =>
                  setFormData({ ...formData, secretKey: e.target.value })
                }
                placeholder={formData.isTestMode ? "sk_test_..." : "sk_live_..."}
                required
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Bu anahtar backend'de kullanılır ve güvenli bir şekilde saklanır
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookSecret">
                Webhook Secret <span className="text-muted-foreground">(Opsiyonel)</span>
              </Label>
              <Input
                id="webhookSecret"
                type="password"
                value={formData.webhookSecret}
                onChange={(e) =>
                  setFormData({ ...formData, webhookSecret: e.target.value })
                }
                placeholder="whsec_..."
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Webhook güvenliğini sağlamak için kullanılır
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Cards Info */}
        {formData.isTestMode && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Test Kartları
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Test modunda kullanabileceğiniz kart numaraları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border">
                  <span className="font-mono">4242 4242 4242 4242</span>
                  <span className="text-muted-foreground">Başarılı ödeme</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border">
                  <span className="font-mono">4000 0000 0000 0002</span>
                  <span className="text-muted-foreground">Reddedilen kart</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-background border">
                  <span className="font-mono">4000 0027 6000 3184</span>
                  <span className="text-muted-foreground">3D Secure gerekli</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  CVV için herhangi 3 rakam, son kullanma tarihi için gelecekte bir tarih kullanabilirsiniz
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Kaydediliyor..." : "Stripe Ayarlarını Kaydet"}
          </Button>
        </div>
      </form>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Ek Kaynaklar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="https://stripe.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Stripe Dokümantasyonu
          </a>
          <a
            href="https://dashboard.stripe.com/test/payments"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Test Ödemelerini Görüntüle
          </a>
          <a
            href="https://dashboard.stripe.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Webhook Ayarları
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminStripeConfigPage() {
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
        <StripeConfigContent />
      </Authenticated>
    </AdminLayout>
  );
}
