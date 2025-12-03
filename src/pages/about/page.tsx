import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ShipIcon, ShieldCheckIcon, HeartIcon, TrophyIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="About Us"
        description="Learn about our mission to provide premium yacht and beach equipment with exceptional quality and service."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About YachtBeach</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We're passionate about delivering premium yacht and beach equipment that enhances 
                your luxury lifestyle and maritime adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded with a vision to revolutionize the yacht and beach equipment industry, 
                YachtBeach has been serving maritime enthusiasts and beach lovers worldwide. 
                We understand that quality equipment is essential for safety, comfort, and enjoyment 
                on the water and shore.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our team consists of experienced sailors, water sports enthusiasts, and industry 
                experts who personally test and curate every product we offer. We believe in 
                providing only the best – equipment that meets the highest standards of quality, 
                durability, and performance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From professional yacht equipment to family beach essentials, we're committed to 
                helping you make the most of your time on and near the water.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <TrophyIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                      <p className="text-sm text-muted-foreground">
                        We source only the finest products from trusted manufacturers, ensuring 
                        durability and performance in marine environments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <ShieldCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Safety First</h3>
                      <p className="text-sm text-muted-foreground">
                        All our products meet or exceed international safety standards, giving 
                        you peace of mind on every adventure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <HeartIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Customer Focused</h3>
                      <p className="text-sm text-muted-foreground">
                        Your satisfaction is our priority. We provide exceptional service and 
                        support before, during, and after your purchase.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <ShipIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Expert Knowledge</h3>
                      <p className="text-sm text-muted-foreground">
                        Our team's maritime expertise ensures you get the right equipment and 
                        advice for your specific needs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mission Statement */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-8 pb-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To provide exceptional yacht and beach equipment that enhances your maritime 
                    lifestyle, backed by expert knowledge, outstanding service, and a commitment 
                    to quality that ensures every moment on the water is safe, comfortable, and 
                    unforgettable.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
