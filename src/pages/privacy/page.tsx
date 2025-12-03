import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";

export default function PrivacyPage() {
  const lastUpdated = "December 2024";

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Privacy Policy"
        description="Learn how we collect, use, and protect your personal information."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                YachtBeach ("we," "us," or "our") is committed to protecting your privacy. This 
                Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or make a purchase from us.
              </p>
              <p className="text-muted-foreground">
                Please read this privacy policy carefully. If you do not agree with the terms of 
                this privacy policy, please do not access the site.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                When you make a purchase or create an account, we collect information that you 
                provide to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li>Name and contact information (email address, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">
                When you visit our website, we automatically collect certain information about 
                your device and browsing behavior, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Referring URLs and pages visited</li>
                <li>Time and date of visits</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Processing and fulfilling your orders</li>
                <li>Sending order confirmations and shipping notifications</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Improving our website and services</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Detecting and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may 
                share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Service Providers:</strong> Third-party companies that help us operate 
                  our business (payment processors, shipping carriers, email service providers)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our 
                  rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, 
                  or sale of assets
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, 
                analyze site traffic, and understand user preferences. Cookies are small data files 
                stored on your device.
              </p>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. However, disabling cookies 
                may limit your ability to use certain features of our website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or 
                destruction. We use SSL encryption for all payment transactions and work with 
                trusted payment processor Stripe to ensure your payment information is secure.
              </p>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the internet or electronic storage is 100% 
                secure. While we strive to protect your personal information, we cannot guarantee 
                its absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Access:</strong> Request access to the personal information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal information
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing emails at any time
                </li>
                <li>
                  <strong>Data Portability:</strong> Request a copy of your data in a portable format
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our website is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you believe we have 
                inadvertently collected such information, please contact us immediately.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your 
                country of residence. These countries may have data protection laws that differ 
                from your country. We take steps to ensure your information receives an adequate 
                level of protection.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. The updated version will be 
                indicated by an updated "Last Updated" date. We encourage you to review this 
                Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> privacy@yachtbeach.com<br />
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
