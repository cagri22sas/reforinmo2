import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@/components/ui/signin.tsx";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Id } from "@/convex/_generated/dataModel.d.ts";

interface CheckoutForm {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  shippingMethodId: Id<"shippingMethods">;
  notes?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useQuery(api.cart.get, {});
  const shippingMethods = useQuery(api.shipping.getActiveMethods, {}) as Array<{
    _id: Id<"shippingMethods">;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    active: boolean;
    order: number;
  }> | undefined;
  const createOrder = useMutation(api.orders.create);
  const createCheckout = useAction(api.stripe.createCheckoutSession);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      country: "Türkiye",
    },
  });

  const selectedShippingMethodId = watch("shippingMethodId");
  const selectedShippingMethod = shippingMethods?.find(
    (m: { _id: Id<"shippingMethods"> }) => m._id === selectedShippingMethodId,
  );

  const subtotal =
    cartItems?.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0) || 0;

  const shippingCost = selectedShippingMethod?.price || 0;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    if (!data.shippingMethodId) {
      toast.error("Lütfen bir kargo yöntemi seçin");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderId = await createOrder({
        shippingMethodId: data.shippingMethodId,
        shippingAddress: {
          name: data.name,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phone: data.phone,
        },
        notes: data.notes,
      });

      // Create Stripe checkout session
      const { url } = await createCheckout({ orderId });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sipariş oluşturulamadı",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Sepete Dön
            </Link>
            <h1 className="text-4xl font-bold">Ödeme</h1>
          </div>

          <Unauthenticated>
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">
                Ödeme yapmak için giriş yapın
              </h2>
              <p className="text-muted-foreground mb-8">
                Siparişinizi tamamlamak için hesabınıza giriş yapmanız
                gerekmektedir.
              </p>
              <SignInButton />
            </div>
          </Unauthenticated>

          <Authenticated>
            {!cartItems || !shippingMethods ? (
              <Skeleton className="h-96 w-full" />
            ) : cartItems.length === 0 ? (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">Sepetiniz Boş</h2>
                <p className="text-muted-foreground mb-8">
                  Ödeme yapmak için sepetinizde ürün olması gerekir.
                </p>
                <Link to="/products">
                  <Button size="lg">Alışverişe Başla</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Checkout Form */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Shipping Address */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Teslimat Adresi</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="name">Ad Soyad</Label>
                          <Input
                            id="name"
                            {...register("name", {
                              required: "Ad soyad gerekli",
                            })}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="street">Adres</Label>
                          <Input
                            id="street"
                            {...register("street", {
                              required: "Adres gerekli",
                            })}
                            placeholder="Sokak, Mahalle, No"
                          />
                          {errors.street && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.street.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">Şehir</Label>
                            <Input
                              id="city"
                              {...register("city", {
                                required: "Şehir gerekli",
                              })}
                              placeholder="İstanbul"
                            />
                            {errors.city && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.city.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="state">İlçe</Label>
                            <Input
                              id="state"
                              {...register("state", {
                                required: "İlçe gerekli",
                              })}
                              placeholder="Kadıköy"
                            />
                            {errors.state && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.state.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">Posta Kodu</Label>
                            <Input
                              id="zipCode"
                              {...register("zipCode", {
                                required: "Posta kodu gerekli",
                              })}
                              placeholder="34000"
                            />
                            {errors.zipCode && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.zipCode.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                              id="phone"
                              {...register("phone", {
                                required: "Telefon gerekli",
                              })}
                              placeholder="+90 555 123 4567"
                            />
                            {errors.phone && (
                              <p className="text-sm text-destructive mt-1">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="country">Ülke</Label>
                          <Input
                            id="country"
                            {...register("country", {
                              required: "Ülke gerekli",
                            })}
                            placeholder="Türkiye"
                          />
                          {errors.country && (
                            <p className="text-sm text-destructive mt-1">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping Method */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Kargo Yöntemi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={selectedShippingMethodId}
                          onValueChange={(value) =>
                            setValue(
                              "shippingMethodId",
                              value as Id<"shippingMethods">,
                            )
                          }
                        >
                          {shippingMethods.map((method) => (
                            <div
                              key={method._id}
                              className="flex items-center space-x-3 border rounded-lg p-4"
                            >
                              <RadioGroupItem
                                value={method._id}
                                id={method._id}
                              />
                              <Label
                                htmlFor={method._id}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">
                                      {method.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {method.description} -{" "}
                                      {method.estimatedDays}
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    {method.price === 0
                                      ? "ÜCRETSİZ"
                                      : `₺${method.price.toFixed(2)}`}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors.shippingMethodId && (
                          <p className="text-sm text-destructive mt-2">
                            Lütfen bir kargo yöntemi seçin
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sipariş Notu (Opsiyonel)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          {...register("notes")}
                          placeholder="Siparişiniz ile ilgili özel notlarınız..."
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <Card className="sticky top-24">
                      <CardHeader>
                        <CardTitle>Sipariş Özeti</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {cartItems.map((item) => (
                            <div
                              key={item._id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.product.name} x {item.quantity}
                              </span>
                              <span>
                                ₺
                                {(item.product.price * item.quantity).toFixed(
                                  2,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Ara Toplam
                            </span>
                            <span>₺{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kargo</span>
                            <span>
                              {shippingCost === 0
                                ? "ÜCRETSİZ"
                                : `₺${shippingCost.toFixed(2)}`}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Toplam</span>
                            <span>₺{total.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                              İşleniyor...
                            </>
                          ) : (
                            "Ödemeye Geç"
                          )}
                        </Button>

                        <div className="text-xs text-muted-foreground text-center">
                          Stripe güvenli ödeme ile korunuyorsunuz
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            )}
          </Authenticated>
        </div>
      </div>

      <Footer />
    </div>
  );
}
