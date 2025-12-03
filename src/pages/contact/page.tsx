import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, SendIcon, MessageSquareIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "motion/react";

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

  const contactMethods = [
    {
      icon: MailIcon,
      title: "Email",
      value: siteConfig?.contactInfo?.email || "support@yachtbeach.com",
      color: "from-blue-500 to-cyan-600",
      delay: 0
    },
    {
      icon: PhoneIcon,
      title: "Phone",
      value: siteConfig?.contactInfo?.phone || "+1 (555) 123-4567",
      color: "from-green-500 to-emerald-600",
      delay: 0.1
    },
    {
      icon: MapPinIcon,
      title: "Address",
      value: siteConfig?.contactInfo?.address || "123 Harbor Street, Miami, FL 33101",
      color: "from-purple-500 to-pink-600",
      delay: 0.2
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      value: "Mon-Fri: 9AM-6PM\nSat: 10AM-4PM\nSun: Closed",
      color: "from-orange-500 to-red-600",
      delay: 0.3
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <SEO
        title="Contact Us"
        description="Get in touch with our team. We're here to help with any questions about our products or services."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section with 3D Elements */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-background border-b">
          {/* Animated background circles */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-primary via-primary/80 to-accent rounded-3xl shadow-2xl"
              >
                <MessageSquareIcon className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                Get In Touch
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              >
                Have questions? We're here to help you navigate your maritime needs.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Contact Information Cards */}
            <div className="lg:col-span-2 space-y-6">
              {contactMethods.map((method) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: method.delay }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                >
                  <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    {/* Background glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${method.color} rounded-full opacity-10 blur-2xl`} />
                    
                    <CardContent className="pt-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`bg-gradient-to-br ${method.color} p-3 rounded-xl shadow-lg`}
                        >
                          <method.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {method.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:col-span-3"
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
                {/* Animated gradient background */}
                <motion.div
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(var(--primary), 0.03), rgba(var(--accent), 0.03))",
                      "linear-gradient(225deg, rgba(var(--accent), 0.03), rgba(var(--primary), 0.03))",
                      "linear-gradient(135deg, rgba(var(--primary), 0.03), rgba(var(--accent), 0.03))",
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute inset-0"
                />
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl md:text-3xl">Send Us a Message</CardTitle>
                  <p className="text-muted-foreground">We typically respond within 24 hours</p>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          placeholder="John Doe"
                          className="mt-1.5"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="email">Email Address *</Label>
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
                          className="mt-1.5"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        placeholder="How can we help you?"
                        className="mt-1.5"
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      <Label htmlFor="message">Message *</Label>
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
                        className="mt-1.5 resize-none"
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <SendIcon className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
