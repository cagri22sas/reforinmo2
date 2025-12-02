import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import { Button } from "@/components/ui/button.tsx";
import { XCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-6">
              <XCircleIcon className="h-16 w-16 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Ödeme İptal Edildi</h1>
            <p className="text-muted-foreground">
              Ödeme işleminiz iptal edildi. Sepetinizdeki ürünler
              korunmaktadır.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/cart" className="block">
              <Button size="lg" className="w-full">
                Sepete Dön
              </Button>
            </Link>
            <Link to="/products" className="block">
              <Button size="lg" variant="outline" className="w-full">
                Alışverişe Devam Et
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
