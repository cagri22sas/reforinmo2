import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckCircle2Icon, PackageIcon } from "lucide-react";
import { motion } from "motion/react";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/50 shadow-2xl text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 mb-8"
            >
              <CheckCircle2Icon className="w-12 h-12 text-green-500" />
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Payment Successful!
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your order. Your payment has been processed successfully.
            </p>

            {/* Info Box */}
            <div className="bg-muted/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <PackageIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• You'll receive an order confirmation email shortly</li>
                    <li>• Your order will be processed within 1-2 business days</li>
                    <li>• You can track your order from your account page</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/")}
                className="rounded-full px-8"
              >
                Continue Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/orders")}
                className="rounded-full px-8"
              >
                View Orders
              </Button>
            </div>

            {/* Auto Redirect Info */}
            <p className="text-xs text-muted-foreground mt-8">
              You will be automatically redirected to the home page in 10 seconds
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
