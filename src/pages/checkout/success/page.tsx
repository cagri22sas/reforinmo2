import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircleIcon className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your order has been successfully created. Order details have been
              sent to your email address.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/orders" className="block">
              <Button size="lg" className="w-full">
                View My Orders
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button size="lg" variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Thank you! 🎉</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
