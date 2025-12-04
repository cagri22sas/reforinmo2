import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CheckCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, translations } from "@/hooks/use-language.ts";

export default function CheckoutSuccessPage() {
  const { language } = useLanguage();
  const t = translations[language];
  
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
            <h1 className="text-3xl font-bold">{t.paymentSuccessful}</h1>
            <p className="text-muted-foreground">
              {t.orderCreated}
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/orders" className="block">
              <Button size="lg" className="w-full">
                {t.viewMyOrders}
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button size="lg" variant="outline" className="w-full">
                {t.continueShopping}
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>{t.thankYou}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
