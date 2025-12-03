import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { motion, AnimatePresence } from "motion/react";

interface NewsletterSubscribeProps {
  variant?: "default" | "inline" | "footer";
  className?: string;
}

export default function NewsletterSubscribe({ 
  variant = "default",
  className = "" 
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const result = await subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
        source: "website-footer",
      });
      
      toast.success(result.message);
      setIsSubscribed(true);
      setEmail("");
      setName("");

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      if (error instanceof ConvexError) {
        const { message } = error.data as { code: string; message: string };
        toast.error(message);
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "inline") {
    return (
      <div className={`relative ${className}`}>
        <AnimatePresence mode="wait">
          {isSubscribed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-600"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Successfully subscribed!</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !email.trim()}>
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={className}>
        <AnimatePresence mode="wait">
          {isSubscribed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20"
            >
              <CheckCircle2 className="h-12 w-12 text-green-600 mb-3" />
              <p className="font-semibold text-green-600">Successfully subscribed!</p>
              <p className="text-sm text-muted-foreground mt-1">Check your inbox for updates</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !email.trim()}
                  size="lg"
                >
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get exclusive offers, product updates, and marine lifestyle tips
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant - full section
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden border-2">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">You're all set!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for subscribing to our newsletter. Check your inbox for exclusive updates.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                        <Mail className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold mb-3">Stay Updated</h3>
                      <p className="text-muted-foreground text-lg">
                        Subscribe to our newsletter for exclusive offers, new product launches, and marine lifestyle tips
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="Your name (optional)"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                          className="h-12"
                        />
                        <Input
                          type="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-12"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading || !email.trim()}
                        className="w-full"
                        size="lg"
                      >
                        {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Also export a minimal Card import for the default variant
import { Card } from "@/components/ui/card";
