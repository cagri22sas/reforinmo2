import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ShipIcon, ShieldCheckIcon, HeartIcon, TrophyIcon, AnchorIcon, CompassIcon, WavesIcon } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <SEO
        title="About Us"
        description="Learn about our mission to provide premium yacht and beach equipment with exceptional quality and service."
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section with 3D Marine Elements */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-background border-b">
          {/* Animated background waves */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <motion.path
                  fill="currentColor"
                  className="text-primary/20"
                  initial={{ d: "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                  animate={{ d: "M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
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
                <AnchorIcon className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
              >
                About YachtBeach
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              >
                Navigating excellence in marine lifestyle. Premium equipment for those who live and breathe the ocean.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Story Section with 3D Cards */}
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-2 gap-12 items-center mb-24"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
                >
                  <CompassIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Our Journey</span>
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Charting New Waters
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg">
                  <p>
                    Born from a passion for the sea, YachtBeach emerged as a beacon of quality in marine equipment. We're not just suppliers – we're sailors, divers, and ocean enthusiasts who understand what it means to trust your gear.
                  </p>
                  <p>
                    Every product in our collection has been tested in real conditions, from calm harbors to challenging open waters. We believe in equipment that performs when it matters most.
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-xl flex items-center justify-center">
                    <WavesIcon className="w-32 h-32 text-primary/40" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </div>
                
                {/* Floating decorative elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-2xl shadow-xl opacity-80"
                />
                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl opacity-60"
                />
              </motion.div>
            </motion.div>

            {/* Values Grid with 3D Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-24"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Our Core Values
              </h2>
              <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
                The principles that guide every decision we make
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: TrophyIcon,
                    title: "Premium Quality",
                    description: "Only the finest marine-grade products that withstand the test of time and elements.",
                    color: "from-amber-500 to-orange-600"
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: "Safety First",
                    description: "Rigorous testing and certification ensure your adventures are always secure.",
                    color: "from-green-500 to-emerald-600"
                  },
                  {
                    icon: HeartIcon,
                    title: "Customer Passion",
                    description: "Your satisfaction fuels our commitment to exceptional service and support.",
                    color: "from-red-500 to-pink-600"
                  },
                  {
                    icon: ShipIcon,
                    title: "Expert Knowledge",
                    description: "Decades of maritime expertise guide our curation and recommendations.",
                    color: "from-blue-500 to-cyan-600"
                  }
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <Card className="h-full bg-gradient-to-br from-card to-muted/50 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                      <CardContent className="pt-8 pb-6 text-center relative overflow-hidden">
                        {/* Background glow effect */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${value.color} rounded-full opacity-10 blur-3xl`} />
                        
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br ${value.color} rounded-2xl shadow-lg relative z-10`}
                        >
                          <value.icon className="h-8 w-8 text-white" />
                        </motion.div>
                        
                        <h3 className="font-bold text-xl mb-3 relative z-10">{value.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mission Statement with 3D Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
                {/* Animated background gradient */}
                <motion.div
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(var(--primary), 0.05), rgba(var(--accent), 0.05))",
                      "linear-gradient(225deg, rgba(var(--accent), 0.05), rgba(var(--primary), 0.05))",
                      "linear-gradient(135deg, rgba(var(--primary), 0.05), rgba(var(--accent), 0.05))",
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute inset-0"
                />
                
                <CardContent className="relative z-10 pt-16 pb-16 px-8">
                  <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary to-accent rounded-full shadow-xl"
                    >
                      <AnchorIcon className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      To empower maritime enthusiasts with premium equipment that transforms every voyage into an extraordinary experience. We're committed to quality, safety, and innovation – ensuring that whether you're navigating open waters or relaxing on shore, you're equipped for excellence.
                    </p>
                  </div>
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
