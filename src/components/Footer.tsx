import { Link } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";

type SiteConfigWithUrls = {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footerText: string;
  logoUrl: string | null;
  faviconUrl: string | null;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const siteConfig = useQuery(api.admin.siteConfig.get, {}) as SiteConfigWithUrls | null | undefined;

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {siteConfig?.siteName || "YachtBeach"}
            </div>
            <p className="text-sm text-muted-foreground">
              {siteConfig?.siteDescription || "Premium products for your luxury lifestyle"}
            </p>
            {siteConfig?.contactInfo && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  <span>{siteConfig.contactInfo.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{siteConfig.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{siteConfig.contactInfo.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shipping" className="hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-primary transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {siteConfig?.socialLinks?.facebook && (
                <a 
                  href={siteConfig.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {siteConfig?.socialLinks?.instagram && (
                <a 
                  href={siteConfig.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              {siteConfig?.socialLinks?.twitter && (
                <a 
                  href={siteConfig.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <TwitterIcon className="h-5 w-5" />
                </a>
              )}
              {siteConfig?.socialLinks?.youtube && (
                <a 
                  href={siteConfig.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{siteConfig?.footerText || `© ${currentYear} YachtBeach. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
