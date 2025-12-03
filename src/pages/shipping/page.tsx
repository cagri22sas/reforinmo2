import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { TruckIcon, PackageIcon, MapIcon, ClockIcon } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Shipping Information"
        description="Learn about our shipping options, delivery times, and international shipping policies."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping Information</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Fast, reliable delivery to get your products to you quickly and safely.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Shipping Methods */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Shipping Methods</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <TruckIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          5-7 business days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Our most economical option, perfect for non-urgent orders.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <PackageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          2-3 business days
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Faster delivery for when you need your items quickly.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Free Shipping */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <TruckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
                    <p className="text-sm text-muted-foreground">
                      Enjoy free standard shipping on all orders over €500. No code needed – 
                      the discount is automatically applied at checkout.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Order Processing</h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground">
                  Orders are typically processed within 1-2 business days. You'll receive a 
                  confirmation email with tracking information once your order ships.
                </p>
                <div className="bg-muted/50 p-6 rounded-lg mt-4">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold mb-2">Important Note:</p>
                      <p className="text-sm text-muted-foreground">
                        Orders placed on weekends or holidays will be processed on the next 
                        business day. During peak seasons, processing times may be slightly longer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div>
              <h2 className="text-3xl font-bold mb-6">International Shipping</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Worldwide Delivery</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We ship to most countries worldwide. International shipping times vary 
                        by destination:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>Europe:</strong> 5-10 business days</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>North America:</strong> 7-14 business days</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>Asia & Pacific:</strong> 10-20 business days</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span><strong>Rest of World:</strong> 15-30 business days</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-muted-foreground">
                      <strong>Customs & Duties:</strong> International orders may be subject to 
                      import duties and taxes, which are the responsibility of the customer. 
                      These charges are not included in our prices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tracking */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Order Tracking</h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground mb-4">
                  Once your order ships, you'll receive an email with a tracking number. You can 
                  use this number to track your package's journey to your doorstep.
                </p>
                <p className="text-muted-foreground">
                  You can also track your order by logging into your account and visiting the 
                  "My Orders" page, where you'll find real-time updates on all your orders.
                </p>
              </div>
            </div>

            {/* Contact */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Questions about shipping?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about our shipping policies or need assistance with 
                  an order, please don't hesitate to contact us.
                </p>
                <p className="text-sm text-primary font-medium">
                  Contact our support team for help with shipping questions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
