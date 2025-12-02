import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  canonicalUrl,
  structuredData,
}: SEOProps) {
  const currentUrl = canonicalUrl || window.location.href;

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:type" content="image/png" />}
      
      {/* Twitter Card */}
      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
