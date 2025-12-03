import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";

export default function TermsPage() {
  const lastUpdated = "December 2024";

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Terms of Service"
        description="Read our terms of service and conditions for using our website and purchasing our products."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using YachtBeach's website and services, you agree to be bound by 
                these Terms of Service and all applicable laws and regulations. If you do not agree 
                with any part of these terms, you may not use our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Use of Our Website</h2>
              
              <h3 className="text-xl font-semibold mb-3">Permitted Use</h3>
              <p className="text-muted-foreground mb-4">
                You may use our website for lawful purposes only. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Transmit harmful code or malware</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in any fraudulent activity</li>
                <li>Harass or harm other users</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Account Responsibilities</h3>
              <p className="text-muted-foreground">
                If you create an account, you are responsible for maintaining the confidentiality 
                of your account credentials and for all activities that occur under your account. 
                You must notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Products and Services</h2>
              
              <h3 className="text-xl font-semibold mb-3">Product Information</h3>
              <p className="text-muted-foreground mb-4">
                We strive to provide accurate product descriptions, images, and pricing. However, 
                we do not warrant that product descriptions or other content is error-free, complete, 
                or current. We reserve the right to correct errors and update information at any time.
              </p>

              <h3 className="text-xl font-semibold mb-3">Pricing</h3>
              <p className="text-muted-foreground mb-4">
                All prices are listed in Euros (€) and are subject to change without notice. We 
                reserve the right to modify prices at any time. The price charged will be the 
                price displayed at the time of order placement.
              </p>

              <h3 className="text-xl font-semibold mb-3">Availability</h3>
              <p className="text-muted-foreground">
                All products are subject to availability. We reserve the right to limit quantities 
                or discontinue products. If a product becomes unavailable after you place an order, 
                we will notify you and provide a full refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Orders and Payment</h2>
              
              <h3 className="text-xl font-semibold mb-3">Order Acceptance</h3>
              <p className="text-muted-foreground mb-4">
                Your order is an offer to purchase products. We reserve the right to accept or 
                decline your order for any reason, including product availability, errors in pricing 
                or product information, or suspected fraud.
              </p>

              <h3 className="text-xl font-semibold mb-3">Payment</h3>
              <p className="text-muted-foreground mb-4">
                Payment is processed securely through Stripe. By providing payment information, 
                you represent that you are authorized to use the payment method. You agree to pay 
                all charges at the prices in effect when the charges are incurred.
              </p>

              <h3 className="text-xl font-semibold mb-3">Order Cancellation</h3>
              <p className="text-muted-foreground">
                We may cancel or refuse any order at our discretion, including orders that appear 
                fraudulent or violate these terms. If we cancel your order after payment has been 
                processed, we will issue a full refund.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Shipping and Delivery</h2>
              <p className="text-muted-foreground mb-4">
                We ship to most locations worldwide. Shipping times and costs vary by destination 
                and shipping method. Title and risk of loss pass to you upon delivery to the carrier.
              </p>
              <p className="text-muted-foreground">
                We are not responsible for delays caused by carriers, customs, or circumstances 
                beyond our control. Please refer to our Shipping Policy for detailed information.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Returns and Refunds</h2>
              <p className="text-muted-foreground">
                We offer a 30-day return policy for most items. Returns must meet certain conditions 
                to be eligible for a refund. Please refer to our Return Policy for complete details 
                on returns, exchanges, and refunds.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on our website, including text, images, logos, graphics, and software, 
                is the property of YachtBeach or our licensors and is protected by copyright, 
                trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, or create derivative works from any 
                content without our express written permission.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                To the fullest extent permitted by law, YachtBeach shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, or any loss of 
                profits or revenues, whether incurred directly or indirectly.
              </p>
              <p className="text-muted-foreground">
                Our total liability for any claims arising from your use of our website or products 
                shall not exceed the amount you paid for the product(s) in question.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless YachtBeach and its officers, directors, 
                employees, and agents from any claims, damages, losses, or expenses arising from 
                your violation of these Terms or your use of our website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
              <p className="text-muted-foreground mb-4">
                Any disputes arising from these Terms or your use of our services shall be resolved 
                through binding arbitration in accordance with the rules of the American Arbitration 
                Association.
              </p>
              <p className="text-muted-foreground">
                You waive any right to participate in a class action lawsuit or class-wide arbitration.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the 
                State of Florida, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. Changes will be effective 
                immediately upon posting to the website. Your continued use of our services after 
                changes are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Severability</h2>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that 
                provision shall be limited or eliminated to the minimum extent necessary, and the 
                remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> legal@yachtbeach.com<br />
                  <strong>Address:</strong> 123 Harbor Street, Miami, FL 33101
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
