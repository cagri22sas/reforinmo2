import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ShipIcon, ShieldCheckIcon, HeartIcon, TrophyIcon, AnchorIcon, CompassIcon, WavesIcon, Users, Award, Globe, Sparkles, Target, Zap, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useTranslation } from "@/hooks/use-language.ts";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const { t } = useTranslation();
  const page = useQuery(api.pages.getBySlug, { slug: "about" });

  if (page === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <Skeleton className="h-12 w-64 mb-8 mx-auto" />
          <Skeleton className="h-96 w-full max-w-4xl mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  // If page exists in database, show custom content
  if (page) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title={page.title}
          description={page.metaDescription || t("about")}
        />
        <Header />
        
        <div className="flex-1">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 border-b">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{page.title}</h1>
                {page.metaDescription && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {page.metaDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="container mx-auto px-4 py-16">
            <div 
              className="max-w-4xl mx-auto prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Default About page with 3D design (fallback if no custom page)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <SEO
        title={t("about")}
        description={t("navigationExcellence")}
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section - Modern & Dynamic */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-6 sm:mb-8"
              >
                <Badge className="px-4 py-2 text-sm sm:text-base bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("about")}
                </Badge>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-center leading-tight"
              >
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {t("aboutReforinmoMarine")}
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mb-10 sm:mb-12"
              >
                {t("navigationExcellence")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/products">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg group">
                    {t("exploreProducts")}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg">
                    {t("contactUs")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
              <path fill="currentColor" fillOpacity="0.1" className="text-primary" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { icon: Users, number: "1K+", label: t("happyCustomers") },
                { icon: Award, number: "4+", label: t("yearsExperience") },
                { icon: Globe, number: "42+", label: t("countriesServed") },
                { icon: ShipIcon, number: "2K+", label: t("productsDelivered") },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl"
                  >
                    <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </motion.div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section - Modern Layout */}
        <div className="py-16 sm:py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                    <CompassIcon className="w-4 h-4 mr-2" />
                    {t("ourJourney")}
                  </Badge>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    {t("chartingNewWaters")}
                  </h2>
                  
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                    <p>{t("aboutStory1")}</p>
                    <p>{t("aboutStory2")}</p>
                  </div>

                  {/* Mini Features */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[
                      { icon: Target, label: t("qualityFirst") },
                      { icon: Zap, label: t("innovationDriven") },
                    ].map((feature) => (
                      <motion.div
                        key={feature.label}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-semibold">{feature.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-xl flex items-center justify-center">
                      <WavesIcon className="w-24 h-24 sm:w-32 sm:h-32 text-primary/40" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-2xl opacity-90 flex items-center justify-center"
                  >
                    <AnchorIcon className="w-10 h-10 sm:w-16 sm:h-16 text-primary-foreground" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [0, 15, 0],
                      rotate: [0, -5, 0],
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-accent to-primary rounded-2xl shadow-xl opacity-80"
                  />
                </motion.div>
              </div>

              {/* Values Grid - Enhanced */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("ourCoreValues")}
                </Badge>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  {t("guidingPrinciples")}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("coreValuesPrinciples")}
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 lg:mb-24">
                {[
                  {
                    icon: TrophyIcon,
                    title: t("premiumQualityTitle"),
                    description: t("premiumQualityDesc"),
                    color: "from-amber-500 to-orange-600"
                  },
                  {
                    icon: ShieldCheckIcon,
                    title: t("safetyFirst"),
                    description: t("safetyFirstDesc"),
                    color: "from-green-500 to-emerald-600"
                  },
                  {
                    icon: HeartIcon,
                    title: t("customerPassion"),
                    description: t("customerPassionDesc"),
                    color: "from-red-500 to-pink-600"
                  },
                  {
                    icon: ShipIcon,
                    title: t("expertKnowledge"),
                    description: t("expertKnowledgeDesc"),
                    color: "from-blue-500 to-cyan-600"
                  }
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                        <CardContent className="pt-6 pb-6 px-4 sm:px-6 text-center relative overflow-hidden">
                          {/* Glow effect */}
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br ${value.color} rounded-full opacity-5 blur-3xl`} />
                          
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-4 bg-gradient-to-br ${value.color} rounded-2xl shadow-lg relative z-10`}
                          >
                            <value.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                          </motion.div>
                          
                          <h3 className="font-bold text-base sm:text-lg mb-2 relative z-10">{value.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed relative z-10">
                            {value.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Mission/Vision Cards */}
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Mission Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="h-full relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <CardContent className="relative z-10 p-6 sm:p-8 lg:p-10">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl"
                      >
                        <Target className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t("ourMission")}</h3>
                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {t("missionStatement")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Vision Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="h-full relative overflow-hidden border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                    <CardContent className="relative z-10 p-6 sm:p-8 lg:p-10">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: -5 }}
                        className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-accent to-primary rounded-2xl shadow-xl"
                      >
                        <Sparkles className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t("ourVision")}</h3>
                      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {t("visionStatement")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary to-accent rounded-full shadow-2xl"
              >
                <AnchorIcon className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {t("readyToExplore")}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {t("discoverPremiumCollection")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/products">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg group">
                    {t("shopNow")}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg">
                    {t("getInTouch")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
