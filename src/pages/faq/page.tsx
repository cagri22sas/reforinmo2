import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about our products, shipping, returns, and more."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Quick answers to common questions about our products and services.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Orders & Shipping */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Orders & Shipping</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How long does shipping take?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Standard shipping takes 5-7 business days, while express shipping takes 2-3 
                    business days. Orders are typically processed within 1-2 business days. 
                    International shipping times vary by destination.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Do you offer free shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! We offer free standard shipping on all orders over €500. The discount 
                    is automatically applied at checkout, no code needed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I track my order?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! Once your order ships, you'll receive an email with a tracking 
                    number. You can also track your order by logging into your account and 
                    visiting the "My Orders" page.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Do you ship internationally?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, we ship to most countries worldwide. International shipping times and 
                    costs vary by destination. Please note that international orders may be 
                    subject to customs duties and import taxes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I change or cancel my order?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    If you need to change or cancel your order, please contact us immediately. 
                    Once an order has been processed and shipped, we cannot make changes. However, 
                    you can return the items according to our return policy.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Returns & Refunds */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Returns & Refunds</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-6" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What is your return policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We offer a 30-day money-back guarantee. If you're not satisfied with your 
                    purchase, you can return it within 30 days of delivery for a full refund. 
                    Items must be in original, unused condition with all original packaging.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How do I return an item?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Contact our support team with your order number and reason for return. We'll 
                    provide you with return instructions and a return authorization. Once we 
                    receive and inspect your return, we'll process your refund within 5-7 business days.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How long does it take to receive a refund?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Refunds are processed within 5-7 business days after we receive your return. 
                    Depending on your bank or credit card company, it may take an additional 3-5 
                    business days for the refund to appear in your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Who pays for return shipping?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Return shipping costs are typically the customer's responsibility, unless 
                    the return is due to our error or a defective product. In those cases, we'll 
                    provide a prepaid return label.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Products</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-10" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Are your products authentic?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! All our products are 100% authentic and sourced directly from 
                    trusted manufacturers and authorized distributors. We guarantee the quality 
                    and authenticity of every item we sell.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Do products come with a warranty?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Many of our products come with manufacturer warranties. Warranty details vary 
                    by product and brand. Check the product description for specific warranty 
                    information, or contact us for details.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    When will out-of-stock items be available?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Restock dates vary by product. If an item you want is out of stock, please 
                    contact us and we'll be happy to provide an estimated restock date or suggest 
                    similar alternatives.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Payment & Security */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Payment & Security</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-13" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What payment methods do you accept?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We accept all major credit cards (Visa, Mastercard, American Express), as 
                    well as various digital payment methods through our secure Stripe payment 
                    gateway.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-14" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is my payment information secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! We use Stripe for payment processing, which employs bank-level security 
                    and encryption. We never store your credit card information on our servers. 
                    All transactions are protected by SSL encryption.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-15" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I purchase without creating an account?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes! We offer guest checkout, so you can complete your purchase without 
                    creating an account. However, creating an account allows you to track orders, 
                    save addresses, and enjoy a faster checkout experience.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Still Have Questions? */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Still have questions?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Can't find the answer you're looking for? Our customer support team is here to help.
                </p>
                <p className="text-sm text-primary font-medium">
                  Contact us and we'll get back to you as soon as possible
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
