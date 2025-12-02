import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { SearchIcon, TagIcon, ImageIcon, BarChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export default function AdminSEOPage() {
  const seoSettings = useQuery(api.admin.seoSettings.get);
  const updateSettings = useMutation(api.admin.seoSettings.update);

  const [defaultTitle, setDefaultTitle] = useState("");
  const [defaultDescription, setDefaultDescription] = useState("");
  const [defaultKeywords, setDefaultKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleTagManagerId, setGoogleTagManagerId] = useState("");
  const [facebookPixelId, setFacebookPixelId] = useState("");

  useEffect(() => {
    if (seoSettings) {
      setDefaultTitle(seoSettings.defaultTitle);
      setDefaultDescription(seoSettings.defaultDescription);
      setDefaultKeywords(seoSettings.defaultKeywords || "");
      setOgImage(seoSettings.ogImage || "");
      setTwitterHandle(seoSettings.twitterHandle || "");
      setGoogleAnalyticsId(seoSettings.googleAnalyticsId || "");
      setGoogleTagManagerId(seoSettings.googleTagManagerId || "");
      setFacebookPixelId(seoSettings.facebookPixelId || "");
    }
  }, [seoSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateSettings({
        defaultTitle,
        defaultDescription,
        defaultKeywords: defaultKeywords || undefined,
        ogImage: ogImage || undefined,
        twitterHandle: twitterHandle || undefined,
        googleAnalyticsId: googleAnalyticsId || undefined,
        googleTagManagerId: googleTagManagerId || undefined,
        facebookPixelId: facebookPixelId || undefined,
      });
      toast.success("SEO settings updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update settings");
    }
  };

  if (seoSettings === undefined) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">SEO ve Meta Ayarları</h1>
          <p className="text-muted-foreground mt-2">
            Arama motorları için sitenizin varsayılan SEO ayarlarını yönetin
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">
                <SearchIcon className="h-4 w-4 mr-2" />
                Genel SEO
              </TabsTrigger>
              <TabsTrigger value="social">
                <ImageIcon className="h-4 w-4 mr-2" />
                Sosyal Medya
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChartIcon className="h-4 w-4 mr-2" />
                Analitik
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <TagIcon className="h-4 w-4 mr-2" />
                Gelişmiş
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Varsayılan Meta Bilgileri</CardTitle>
                  <CardDescription>
                    Bu bilgiler, sayfalarda özel SEO ayarları yoksa kullanılır
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultTitle">Varsayılan Başlık</Label>
                    <Input
                      id="defaultTitle"
                      placeholder="Mağaza Adı - Slogan"
                      value={defaultTitle}
                      onChange={(e) => setDefaultTitle(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      İdeal uzunluk: 50-60 karakter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultDescription">Varsayılan Açıklama</Label>
                    <Textarea
                      id="defaultDescription"
                      placeholder="Sitenizin kısa açıklaması..."
                      value={defaultDescription}
                      onChange={(e) => setDefaultDescription(e.target.value)}
                      rows={3}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      İdeal uzunluk: 150-160 karakter
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="defaultKeywords">Anahtar Kelimeler</Label>
                    <Input
                      id="defaultKeywords"
                      placeholder="e-ticaret, online alışveriş, ürün"
                      value={defaultKeywords}
                      onChange={(e) => setDefaultKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Virgülle ayırarak birden fazla anahtar kelime ekleyin
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya Önizleme</CardTitle>
                  <CardDescription>
                    Siteniz sosyal medyada paylaşıldığında görünecek bilgiler
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Open Graph Resim URL</Label>
                    <Input
                      id="ogImage"
                      type="url"
                      placeholder="https://example.com/og-image.jpg"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Önerilen boyut: 1200x630 piksel
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">Twitter Kullanıcı Adı</Label>
                    <Input
                      id="twitterHandle"
                      placeholder="@username"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Twitter/X hesabınızın kullanıcı adı (@ ile)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analitik ve İzleme</CardTitle>
                  <CardDescription>
                    Ziyaretçi analizleri için izleme kodları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      placeholder="G-XXXXXXXXXX"
                      value={googleAnalyticsId}
                      onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Google Analytics takip kimliğiniz
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                    <Input
                      id="googleTagManagerId"
                      placeholder="GTM-XXXXXX"
                      value={googleTagManagerId}
                      onChange={(e) => setGoogleTagManagerId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Google Tag Manager konteyner kimliğiniz
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      placeholder="123456789012345"
                      value={facebookPixelId}
                      onChange={(e) => setFacebookPixelId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Facebook Pixel izleme kimliğiniz
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gelişmiş SEO</CardTitle>
                  <CardDescription>
                    İleri düzey SEO özellikleri ve yapılandırma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium">Otomatik Özellikler</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Ürün sayfalarında Schema.org yapılandırılmış veri</li>
                      <li>✓ Dinamik başlık ve açıklama etiketleri</li>
                      <li>✓ Canonical URL'ler</li>
                      <li>✓ Open Graph ve Twitter Card desteği</li>
                      <li>✓ Her ürün için özel SEO alanları</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                      İpucu
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Her ürün için özel SEO başlığı, açıklaması ve anahtar kelimeler 
                      ayarlayabilirsiniz. Ürün düzenleme sayfasından "SEO Ayarları" 
                      sekmesini kullanın.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="submit" size="lg">
              Ayarları Kaydet
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
