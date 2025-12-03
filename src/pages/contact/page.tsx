import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

type SiteConfigWithUrls = {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footerText: string;
  logoUrl: string | null;
  faviconUrl: string | null;
};

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const siteConfig = useQuery(api.admin.siteConfig.get, {}) as SiteConfigWithUrls | null | undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contact Us"
        description="Get in touch with our team. We're here to help with any questions about our products or services."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Have a question or need assistance? Our team is here to help.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MailIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        {siteConfig?.contactInfo?.email || "support@yachtbeach.com"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-sm text-muted-foreground">
                        {siteConfig?.contactInfo?.phone || "+1 (555) 123-4567"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {siteConfig?.contactInfo?.address || "123 Harbor Street, Miami, FL 33101"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9AM - 6PM<br />
                        Saturday: 10AM - 4PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
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
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        placeholder="How can we help you?"
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        {...register("message", {
                          required: "Message is required",
                          minLength: {
                            value: 10,
                            message: "Message must be at least 10 characters",
                          },
                        })}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
