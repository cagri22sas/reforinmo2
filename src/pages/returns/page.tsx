import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { RotateCcwIcon, CheckCircle2Icon, XCircleIcon, AlertCircleIcon } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Return Policy"
        description="Our hassle-free return policy ensures your satisfaction. Learn about our 30-day return guarantee."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Return Policy</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your satisfaction is our priority. Easy returns within 30 days.
              </p>
            </div>
          </div>
        </div>

        {/* Return Policy Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* 30-Day Guarantee */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <RotateCcwIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">30-Day Money-Back Guarantee</h3>
                    <p className="text-sm text-muted-foreground">
                      We stand behind the quality of our products. If you're not completely satisfied 
                      with your purchase, you can return it within 30 days of delivery for a full refund.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Process */}
            <div>
              <h2 className="text-3xl font-bold mb-6">How to Return an Item</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Contact Us</h3>
                        <p className="text-sm text-muted-foreground">
                          Email our support team with your order number and reason for return. 
                          We'll provide you with a return authorization and instructions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Package Your Item</h3>
                        <p className="text-sm text-muted-foreground">
                          Securely pack the item in its original packaging (if possible) with all 
                          accessories, manuals, and documentation included.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Ship It Back</h3>
                        <p className="text-sm text-muted-foreground">
                          Use the prepaid return label we provide (for eligible returns) or ship 
                          at your own cost. We recommend using a tracked shipping method.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Receive Your Refund</h3>
                        <p className="text-sm text-muted-foreground">
                          Once we receive and inspect your return, we'll process your refund within 
                          5-7 business days to your original payment method.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Eligible Items */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Return Eligibility</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <CheckCircle2Icon className="h-5 w-5 text-green-600 mt-0.5" />
                      <h3 className="font-semibold">Eligible for Return</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Items in original, unused condition</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Items with original packaging and tags</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Items returned within 30 days</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Defective or damaged items</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                      <h3 className="font-semibold">Not Eligible for Return</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Items that have been used or worn</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Items without original packaging</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Custom or personalized items</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-600">✗</span>
                        <span>Clearance or final sale items</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Refund Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Refund Information</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3 className="font-semibold mb-3">Processing Time</h3>
                    <p className="text-muted-foreground mb-4">
                      Refunds are processed within 5-7 business days after we receive your return. 
                      Please note that it may take an additional 3-5 business days for the refund 
                      to appear in your account, depending on your bank or credit card company.
                    </p>
                    
                    <h3 className="font-semibold mb-3">Refund Method</h3>
                    <p className="text-muted-foreground mb-4">
                      All refunds are issued to the original payment method used for the purchase. 
                      If you paid with a credit card, the refund will be credited to that card. 
                      If you paid via another method, we'll process the refund accordingly.
                    </p>
                    
                    <h3 className="font-semibold mb-3">Shipping Costs</h3>
                    <p className="text-muted-foreground">
                      Original shipping costs are non-refundable unless the return is due to our 
                      error or a defective product. Return shipping costs are the customer's 
                      responsibility unless otherwise specified.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exchanges */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Exchanges</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    We currently don't offer direct exchanges. If you need a different size, color, 
                    or product, please return your original item for a refund and place a new order 
                    for the item you want.
                  </p>
                  <p className="text-muted-foreground">
                    This process ensures you receive your preferred item as quickly as possible.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Damaged or Defective Items */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Received a Damaged or Defective Item?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We're sorry if your item arrived damaged or defective. Please contact us 
                      immediately with photos of the damage and your order number. We'll arrange 
                      for a replacement or full refund, including return shipping costs.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please inspect your order upon receipt and report any issues within 48 hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
