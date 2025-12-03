import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import SEO from "@/components/SEO.tsx";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function PrivacyPage() {
  const page = useQuery(api.pages.getBySlug, { slug: "privacy" });

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
          title="Privacy Policy"
          description="Learn how we collect, use, and protect your personal information."
        />
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              This page is currently being updated. Please check back soon.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={page.title}
        description={page.metaDescription || "Privacy Policy"}
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
