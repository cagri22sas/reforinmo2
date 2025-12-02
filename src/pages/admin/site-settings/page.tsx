import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import AdminLayout from "@/components/AdminLayout.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SignInButton } from "@/components/ui/signin.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Settings, Upload, Image as ImageIcon, Globe } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

function SiteSettingsPageInner() {
  const siteConfig = useQuery(api.admin.siteConfig.get, {});
  const updateConfig = useMutation(api.admin.siteConfig.update);
  const generateUploadUrl = useMutation(api.admin.siteConfig.generateUploadUrl);
  const initializeConfig = useMutation(api.admin.siteConfig.initialize);

  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0066CC");
  const [secondaryColor, setSecondaryColor] = useState("#00AAFF");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");
  const [footerText, setFooterText] = useState("");
  const [logoStorageId, setLogoStorageId] = useState<Id<"_storage"> | undefined>();
  const [faviconStorageId, setFaviconStorageId] = useState<Id<"_storage"> | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Initialize config if it doesn't exist
  useEffect(() => {
    if (siteConfig === null) {
      initializeConfig();
    }
  }, [siteConfig, initializeConfig]);

  // Load existing config
  useEffect(() => {
    if (siteConfig) {
      setSiteName(siteConfig.siteName);
      setSiteDescription(siteConfig.siteDescription);
      setPrimaryColor(siteConfig.primaryColor);
      setSecondaryColor(siteConfig.secondaryColor);
      setEmail(siteConfig.contactInfo.email);
      setPhone(siteConfig.contactInfo.phone);
      setAddress(siteConfig.contactInfo.address);
      setFacebook(siteConfig.socialLinks.facebook || "");
      setInstagram(siteConfig.socialLinks.instagram || "");
      setTwitter(siteConfig.socialLinks.twitter || "");
      setYoutube(siteConfig.socialLinks.youtube || "");
      setFooterText(siteConfig.footerText);
      setLogoStorageId(siteConfig.logoStorageId);
      setFaviconStorageId(siteConfig.faviconStorageId);
      setLogoPreview(siteConfig.logoUrl);
      setFaviconPreview(siteConfig.faviconUrl);
    }
  }, [siteConfig]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      setLogoStorageId(storageId);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Logo yüklendi");
    } catch (error) {
      toast.error("Logo yüklenirken hata oluştu");
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      setFaviconStorageId(storageId);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Favicon yüklendi");
    } catch (error) {
      toast.error("Favicon yüklenirken hata oluştu");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateConfig({
        siteName,
        siteDescription,
        logoStorageId,
        faviconStorageId,
        primaryColor,
        secondaryColor,
        socialLinks: {
          facebook: facebook || undefined,
          instagram: instagram || undefined,
          twitter: twitter || undefined,
          youtube: youtube || undefined,
        },
        contactInfo: {
          email,
          phone,
          address,
        },
        footerText,
      });

      toast.success("Site ayarları güncellendi");
    } catch (error) {
      toast.error("Ayarlar güncellenirken hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (siteConfig === undefined) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Site Ayarları</h1>
            <p className="text-muted-foreground">Sitenizin genel ayarlarını yönetin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Genel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Genel Bilgiler
              </CardTitle>
              <CardDescription>Site adı ve açıklama bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Adı</Label>
                <Input
                  id="siteName"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Yacht Beach Store"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea
                  id="siteDescription"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Premium yat ve deniz ürünleri mağazası"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo ve Favicon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo ve Favicon
              </CardTitle>
              <CardDescription>Sitenizin görsel kimlik öğeleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Logo */}
                <div className="space-y-4">
                  <Label>Site Logosu</Label>
                  <div className="space-y-4">
                    {logoPreview && (
                      <div className="flex h-32 items-center justify-center rounded-lg border bg-muted/50">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="max-h-28 max-w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Logo Yükle
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-4">
                  <Label>Favicon</Label>
                  <div className="space-y-4">
                    {faviconPreview && (
                      <div className="flex h-32 items-center justify-center rounded-lg border bg-muted/50">
                        <img
                          src={faviconPreview}
                          alt="Favicon Preview"
                          className="h-16 w-16 object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => faviconInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Favicon Yükle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renkler */}
          <Card>
            <CardHeader>
              <CardTitle>Renk Şeması</CardTitle>
              <CardDescription>Sitenizin ana renk temasını belirleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Ana Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#0066CC"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">İkincil Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#00AAFF"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* İletişim Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription>Müşterilerinizin sizinle iletişime geçmesi için</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@yachtbeach.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 555 123 4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="İstanbul, Türkiye"
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
              <CardDescription>Sosyal medya hesaplarınızın linkleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle>Footer Metni</CardTitle>
              <CardDescription>Sitenizin alt kısmında görünecek metin</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2025 Yacht Beach. Tüm hakları saklıdır."
                rows={2}
                required
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default function SiteSettingsPage() {
  return (
    <>
      <Unauthenticated>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Giriş Gerekli</h1>
            <p className="mb-4 text-muted-foreground">
              Bu sayfayı görüntülemek için giriş yapmalısınız
            </p>
            <SignInButton />
          </div>
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <Skeleton className="h-96 w-full max-w-4xl" />
        </div>
      </AuthLoading>
      <Authenticated>
        <SiteSettingsPageInner />
      </Authenticated>
    </>
  );
}
