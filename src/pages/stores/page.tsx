import { motion } from "motion/react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Fix default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Store = {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  hours: string;
  region: string;
  lat: number;
  lng: number;
};

const stores: Store[] = [
  {
    name: "Reforinmo Marine Calpe Headquarters",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "info@reforinmomarine.com",
    hours: "Mon-Sat: 9:00 - 19:00, Sun: 10:00 - 18:00",
    region: "Mediterranean",
    lat: 38.6436,
    lng: 0.0412,
  },
  {
    name: "Reforinmo Marine Porto Cervo",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "portocervo@reforinmomarine.com",
    hours: "Mon-Sat: 9:00 - 20:00, Sun: 10:00 - 19:00",
    region: "Mediterranean",
    lat: 41.1354,
    lng: 9.5346,
  },
  {
    name: "Reforinmo Marine Miami Beach",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "miami@reforinmomarine.com",
    hours: "Mon-Sun: 9:00 - 21:00",
    region: "Americas",
    lat: 25.7753,
    lng: -80.1900,
  },
  {
    name: "Reforinmo Marine St. Tropez",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "sttropez@reforinmomarine.com",
    hours: "Mon-Sat: 10:00 - 19:00, Sun: 11:00 - 18:00",
    region: "Mediterranean",
    lat: 43.2677,
    lng: 6.6407,
  },
  {
    name: "Reforinmo Marine Nassau",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "nassau@reforinmomarine.com",
    hours: "Mon-Sat: 9:00 - 19:00, Sun: 10:00 - 17:00",
    region: "Caribbean",
    lat: 25.0659,
    lng: -77.3450,
  },
  {
    name: "Reforinmo Marine Dubai Marina",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "dubai@reforinmomarine.com",
    hours: "Mon-Sun: 10:00 - 22:00",
    region: "Middle East",
    lat: 25.0810,
    lng: 55.1400,
  },
  {
    name: "Reforinmo Marine Marbella",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "marbella@reforinmomarine.com",
    hours: "Mon-Sat: 10:00 - 20:00, Sun: 11:00 - 19:00",
    region: "Mediterranean",
    lat: 36.4843,
    lng: -4.9532,
  },
  {
    name: "Reforinmo Marine Antibes",
    address: "CALLE URB LOS PINOS, NUM 16 PUERTA C",
    city: "03710 CALP",
    country: "Spain (ALICANTE)",
    phone: "+34 661 171 490",
    email: "antibes@reforinmomarine.com",
    hours: "Tue-Sat: 9:30 - 19:00, Sun-Mon: Closed",
    region: "Mediterranean",
    lat: 43.5847,
    lng: 7.1250,
  }
];

export default function StoresPage() {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <>
      <SEO 
        title="Store Locator | Find Reforinmo Marine Stores"
        description="Find Reforinmo Marine stores near you. Visit our premium marine equipment showrooms in Monaco, Miami, Dubai, and more exclusive locations worldwide."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
              <motion.div
                className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-primary/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
                >
                  <MapPinIcon className="w-12 h-12 text-primary" />
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Find Our Stores
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Visit our premium showrooms in the world's most exclusive marinas and beach destinations. 
                  Experience luxury yacht equipment and beach accessories in person.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-8 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20"
              >
                <MapContainer
                  center={[35, 10]}
                  zoom={2}
                  className="h-[500px] w-full z-0"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {stores.map((store) => (
                    <Marker
                      key={store.name}
                      position={[store.lat, store.lng]}
                      eventHandlers={{
                        click: () => {
                          setSelectedStore(store);
                        },
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold text-base mb-2">{store.name}</h3>
                          <p className="text-muted-foreground mb-1">
                            {store.address}
                          </p>
                          <p className="text-muted-foreground mb-2">
                            {store.city}, {store.country}
                          </p>
                          <p className="text-xs text-primary font-medium">
                            Click for details
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </motion.div>
            </div>
          </section>

          {/* Stores Grid */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  All Store Locations
                </h2>
                <p className="text-muted-foreground">
                  {selectedStore 
                    ? `Showing details for ${selectedStore.name}`
                    : "Click on a map marker or select a store below"}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store, index) => (
                  <motion.div
                    key={store.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setSelectedStore(store)}
                  >
                    <Card 
                      className={`group hover:shadow-2xl transition-all duration-500 h-full border-2 relative overflow-hidden cursor-pointer ${
                        selectedStore?.name === store.name 
                          ? "border-primary/80 shadow-xl" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500 pointer-events-none" />
                      
                      {/* Region badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
                          {store.region}
                        </span>
                      </div>

                      <CardContent className="p-6 relative z-10">
                        {/* Store name */}
                        <motion.h3 
                          className="text-xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                          whileHover={{ scale: 1.02 }}
                        >
                          {store.name}
                        </motion.h3>

                        <div className="space-y-4">
                          {/* Address */}
                          <motion.div 
                            className="flex items-start gap-3 group/item"
                            whileHover={{ x: 4 }}
                          >
                            <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors mt-0.5 shrink-0">
                              <MapPinIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="text-sm">
                              <p className="text-foreground font-medium">{store.address}</p>
                              <p className="text-muted-foreground">
                                {store.city}, {store.country}
                              </p>
                            </div>
                          </motion.div>

                          {/* Phone */}
                          <motion.a
                            href={`tel:${store.phone}`}
                            className="flex items-center gap-3 group/item text-sm text-muted-foreground hover:text-primary transition-colors"
                            whileHover={{ x: 4 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors shrink-0">
                              <PhoneIcon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{store.phone}</span>
                          </motion.a>

                          {/* Email */}
                          <motion.a
                            href={`mailto:${store.email}`}
                            className="flex items-center gap-3 group/item text-sm text-muted-foreground hover:text-primary transition-colors"
                            whileHover={{ x: 4 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors shrink-0">
                              <MailIcon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="break-all">{store.email}</span>
                          </motion.a>

                          {/* Hours */}
                          <motion.div 
                            className="flex items-start gap-3 group/item"
                            whileHover={{ x: 4 }}
                          >
                            <div className="p-2 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors mt-0.5 shrink-0">
                              <ClockIcon className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {store.hours}
                            </p>
                          </motion.div>
                        </div>
                      </CardContent>

                      {/* Decorative corner accent */}
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-12 overflow-hidden"
              >
                {/* Background decoration */}
                <motion.div
                  className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                <div className="text-center relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Can't Visit Us in Person?
                  </h2>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Shop our entire collection online and enjoy worldwide shipping. 
                    Our customer service team is available 24/7 to assist you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="/products"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Shop Online
                    </motion.a>
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-background/80 backdrop-blur-sm border-2 border-primary/30 text-foreground font-semibold hover:bg-background transition-all duration-300"
                    >
                      Contact Us
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
