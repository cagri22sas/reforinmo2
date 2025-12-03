import { Link } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, MailIcon, PhoneIcon, MapPinIcon, WavesIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import NewsletterSubscribe from "@/components/NewsletterSubscribe.tsx";
import { motion } from "motion/react";

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
    <footer className="relative bg-gradient-to-br from-muted/30 via-background to-muted/20 border-t overflow-hidden">
      {/* Animated wave decoration */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Floating background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
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
          className="absolute bottom-10 right-[10%] w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl"
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                {siteConfig?.siteName || "YachtBeach"}
              </div>
            </motion.div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteConfig?.siteDescription || "Premium products for your luxury lifestyle"}
            </p>
            {siteConfig?.contactInfo && (
              <div className="space-y-3 text-sm">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MailIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{siteConfig.contactInfo.email}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <PhoneIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{siteConfig.contactInfo.phone}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MapPinIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{siteConfig.contactInfo.address}</span>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Quick Links - 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/products", label: "All Products" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
              ].map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service - 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Customer Service
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/shipping", label: "Shipping Info" },
                { to: "/returns", label: "Return Policy" },
                { to: "/faq", label: "FAQ" },
              ].map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Legal - 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
              ].map((link, i) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter - 3 cols, rightmost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group">
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                  Stay Connected
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Subscribe to our newsletter for exclusive offers and updates
                </p>
                <NewsletterSubscribe variant="footer" />
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
            </div>
          </motion.div>
        </div>

        {/* Bottom section with 3D cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border/50"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright & Payment Cards */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <p className="text-sm text-muted-foreground">
                {siteConfig?.footerText || `© ${currentYear} YachtBeach. All rights reserved.`}
              </p>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5, y: -2 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-blue-600/20 blur-lg rounded group-hover:bg-blue-600/40 transition-all" />
                  <div className="relative w-12 h-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-[11px] font-bold shadow-lg cursor-pointer">
                    VISA
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5, y: -2 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-red-500/20 blur-lg rounded group-hover:bg-red-500/40 transition-all" />
                  <div className="relative w-12 h-8 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shadow-lg cursor-pointer">
                    MC
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5, y: -2 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded group-hover:bg-blue-500/40 transition-all" />
                  <div className="relative w-12 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-lg cursor-pointer">
                    AMEX
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </motion.div>
              <span className="text-border">•</span>
              <motion.div whileHover={{ y: -2 }}>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
        animate={{
          x: ["100%", "-100%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </footer>
  );
}
