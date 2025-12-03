import { motion } from "motion/react";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ShieldCheckIcon } from "lucide-react";

export default function WarrantyPage() {
  const page = useQuery(api.pages.getBySlug, { slug: "warranty" });

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

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO
          title="Warranty Information"
          description="Learn about our product warranty and guarantee policies."
        />
        <Header />
        
        <div className="flex-1">
          {/* Hero Section with 3D effects */}
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
                  <ShieldCheckIcon className="w-12 h-12 text-primary" />
                </motion.div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Warranty Information
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  This page is currently being updated in the admin panel. Please check back soon.
                </p>
              </motion.div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={page.title}
        description={page.metaDescription || "Learn about our product warranty and guarantee policies"}
      />
      <Header />
      
      <div className="flex-1">
        {/* Hero Section with 3D effects */}
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
                <ShieldCheckIcon className="w-12 h-12 text-primary" />
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {page.title}
              </h1>
              {page.metaDescription && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {page.metaDescription}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Page Content with 3D cards */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-background via-background to-primary/5 p-8 md:p-12 shadow-2xl border border-primary/10 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-3xl" />
                
                <div 
                  className="relative prose prose-lg dark:prose-invert prose-headings:bg-gradient-to-r prose-headings:from-foreground prose-headings:to-primary prose-headings:bg-clip-text prose-headings:text-transparent max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
