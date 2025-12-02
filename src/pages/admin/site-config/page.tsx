import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import AdminLayout from "@/components/AdminLayout.tsx";
import { toast } from "sonner";
import { SaveIcon, UploadIcon, ImageIcon, PaletteIcon, GlobeIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

function SiteConfigContent() {
  const siteConfig = useQuery(api.admin.siteConfig.get, {});
  const updateConfig = useMutation(api.admin.siteConfig.update);
  const generateUploadUrl = useMutation(api.admin.siteConfig.generateUploadUrl);
  const updateLogo = useMutation(api.admin.siteConfig.updateLogo);
  const updateFavicon = useMutation(api.admin.siteConfig.updateFavicon);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    primaryColor: "",
    secondaryColor: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    email: "",
    phone: "",
    address: "",
    footerText: "",
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  if (siteConfig && !isDataLoaded) {
    setFormData({
      siteName: siteConfig.siteName || "",
      siteDescription: siteConfig.siteDescription || "",
      primaryColor: siteConfig.primaryColor || "#0ea5e9",
      secondaryColor: siteConfig.secondaryColor || "#0284c7",
      facebook: siteConfig.socialLinks?.facebook || "",
      instagram: siteConfig.socialLinks?.instagram || "",
      twitter: siteConfig.socialLinks?.twitter || "",
      youtube: siteConfig.socialLinks?.youtube || "",
      email: siteConfig.contactInfo?.email || "",
      phone: siteConfig.contactInfo?.phone || "",
      address: siteConfig.contactInfo?.address || "",
      footerText: siteConfig.footerText || "",
    });
    setIsDataLoaded(true);
  }

  if (siteConfig === undefined) {
    return <Skeleton className="h-96 w-full" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateConfig({
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        socialLinks: {
          facebook: formData.facebook || undefined,
          instagram: formData.instagram || undefined,
          twitter: formData.twitter || undefined,
          youtube: formData.youtube || undefined,
        },
        contactInfo: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        },
        footerText: formData.footerText,
      });
      toast.success("Site ayarları kaydedildi");
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await response.json();
      await updateLogo({ storageId: storageId as Id<"_storage"> });
      toast.success("Logo yüklendi");
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Logo yüklenirken bir hata oluştu");
      }
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await response.json();
      await updateFavicon({ storageId: storageId as Id<"_storage"> });
      toast.success("Favicon yüklendi");
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Favicon yüklenirken bir hata oluştu");
      }
    } finally {
      setUploadingFavicon(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Yapılandırması</h1>
        <p className="text-muted-foreground">
          Sitenizin genel ayarlarını, logosunu ve renklerini yönetin
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <GlobeIcon className="h-4 w-4 mr-2" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="branding">
            <ImageIcon className="h-4 w-4 mr-2" />
            Marka
          </TabsTrigger>
          <TabsTrigger value="colors">
            <PaletteIcon className="h-4 w-4 mr-2" />
            Renkler
          </TabsTrigger>
          <TabsTrigger value="contact">
            <MailIcon className="h-4 w-4 mr-2" />
            İletişim
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Bilgileri</CardTitle>
                <CardDescription>
                  Sitenizin temel bilgilerini girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData({ ...formData, siteName: e.target.value })
                    }
                    placeholder="YachtBeach"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={formData.siteDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, siteDescription: e.target.value })
                    }
                    placeholder="Premium deniz yaşam ürünleri..."
                    rows={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    SEO için kullanılacak site açıklaması
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="footerText">Alt Bilgi Metni</Label>
                  <Input
                    id="footerText"
                    value={formData.footerText}
                    onChange={(e) =>
                      setFormData({ ...formData, footerText: e.target.value })
                    }
                    placeholder="© 2024 YachtBeach. Tüm hakları saklıdır."
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logo</CardTitle>
                  <CardDescription>
                    Sitenizin logosunu yükleyin (PNG, JPG veya SVG)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {siteConfig && 'logoUrl' in siteConfig && siteConfig.logoUrl && (
                    <div className="relative w-full aspect-[2/1] rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={siteConfig.logoUrl}
                        alt="Site Logo"
                        className="max-w-full max-h-full object-contain p-4"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    {uploadingLogo ? "Yükleniyor..." : "Logo Yükle"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Favicon</CardTitle>
                  <CardDescription>
                    Tarayıcı sekmesinde görünecek simgeyi yükleyin (32x32 px)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {siteConfig && 'faviconUrl' in siteConfig && siteConfig.faviconUrl && (
                    <div className="relative w-32 h-32 mx-auto rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={siteConfig.faviconUrl}
                        alt="Favicon"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={handleFaviconUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="w-full"
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    {uploadingFavicon ? "Yükleniyor..." : "Favicon Yükle"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marka Renkleri</CardTitle>
                <CardDescription>
                  Sitenizde kullanılacak ana ve ikincil renkleri seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Ana Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="primaryColor"
                        value={formData.primaryColor}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryColor: e.target.value })
                        }
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) =>
                          setFormData({ ...formData, primaryColor: e.target.value })
                        }
                        placeholder="#0ea5e9"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">İkincil Renk</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                        className="h-12 w-20 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) =>
                          setFormData({ ...formData, secondaryColor: e.target.value })
                        }
                        placeholder="#0284c7"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg border bg-gradient-to-br from-background to-accent/5">
                  <p className="text-sm text-muted-foreground mb-4">Renk Önizlemesi:</p>
                  <div className="flex gap-4">
                    <div
                      className="flex-1 h-24 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.primaryColor }}
                    >
                      Ana Renk
                    </div>
                    <div
                      className="flex-1 h-24 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: formData.secondaryColor }}
                    >
                      İkincil Renk
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>
                  Sitenizde görünecek iletişim bilgilerini girin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <MailIcon className="h-4 w-4 inline mr-2" />
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="info@yachtbeach.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <PhoneIcon className="h-4 w-4 inline mr-2" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+90 (555) 123 45 67"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    <MapPinIcon className="h-4 w-4 inline mr-2" />
                    Adres
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Marina Street, Istanbul, Turkey"
                    rows={3}
                    required
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Sosyal Medya Bağlantıları</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="text-sm text-muted-foreground">
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook: e.target.value })
                      }
                      placeholder="https://facebook.com/yachtbeach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="text-sm text-muted-foreground">
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      placeholder="https://instagram.com/yachtbeach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-sm text-muted-foreground">
                      Twitter/X
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                      placeholder="https://twitter.com/yachtbeach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="text-sm text-muted-foreground">
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={formData.youtube}
                      onChange={(e) =>
                        setFormData({ ...formData, youtube: e.target.value })
                      }
                      placeholder="https://youtube.com/@yachtbeach"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
              <SaveIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

export default function AdminSiteConfigPage() {
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
        <SiteConfigContent />
      </Authenticated>
    </AdminLayout>
  );
}
