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
import { Separator } from "@/components/ui/separator.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";

function SettingsContent() {
  const settings = useQuery(api.admin.settings.getAll, {});
  const updateSettings = useMutation(api.admin.settings.updateMultiple);

  const [formData, setFormData] = useState({
    freeShippingThreshold: "",
    storeName: "",
    storeEmail: "",
    storePhone: "",
    supportEmail: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings when they arrive
  if (settings && !isLoaded) {
    setFormData({
      freeShippingThreshold: settings.freeShippingThreshold || "0",
      storeName: settings.storeName || "",
      storeEmail: settings.storeEmail || "",
      storePhone: settings.storePhone || "",
      supportEmail: settings.supportEmail || "",
    });
    setIsLoaded(true);
  }

  if (settings === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const settingsArray = Object.entries(formData).map(([key, value]) => ({
        key,
        value: value.toString(),
      }));

      await updateSettings({ settings: settingsArray });
      toast.success("Ayarlar kaydedildi");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Bir hata oluştu");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">
          Site genelindeki ayarları yönetin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Kargo Ayarları</CardTitle>
            <CardDescription>
              Kargo ve teslimat ile ilgili ayarları yapılandırın
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold">
                Ücretsiz Kargo Eşiği (TL)
              </Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                step="0.01"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: e.target.value })
                }
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground">
                Bu tutarın üzerindeki siparişlerde kargo ücretsiz olacaktır. 0
                yazarsanız ücretsiz kargo devre dışı bırakılır.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Mağaza Bilgileri</CardTitle>
            <CardDescription>
              Mağazanızın genel bilgilerini girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Mağaza Adı</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                placeholder="YachtBeach"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeEmail">Mağaza E-posta</Label>
              <Input
                id="storeEmail"
                type="email"
                value={formData.storeEmail}
                onChange={(e) =>
                  setFormData({ ...formData, storeEmail: e.target.value })
                }
                placeholder="info@yachtbeach.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storePhone">Mağaza Telefon</Label>
              <Input
                id="storePhone"
                type="tel"
                value={formData.storePhone}
                onChange={(e) =>
                  setFormData({ ...formData, storePhone: e.target.value })
                }
                placeholder="+90 (555) 123 45 67"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Destek E-posta</Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={(e) =>
                  setFormData({ ...formData, supportEmail: e.target.value })
                }
                placeholder="destek@yachtbeach.com"
              />
              <p className="text-sm text-muted-foreground">
                Müşterilerin destek için iletişime geçebileceği e-posta adresi
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            <SaveIcon className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AdminSettingsPage() {
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
        <SettingsContent />
      </Authenticated>
    </AdminLayout>
  );
}
