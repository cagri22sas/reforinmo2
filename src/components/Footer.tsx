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
              {siteConfig && 'logoUrl' in siteConfig && siteConfig.logoUrl ? (
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.siteName}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <>
                  {/* 3D Marine Icon with Multiple Layers */}
                  <div className="relative">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-lg opacity-40 transition-opacity duration-300" />
                    
                    {/* Main icon container */}
                    <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent p-3 rounded-3xl shadow-2xl transition-all duration-300">
                      {/* Layered marine elements */}
                      <div className="relative">
                        {/* Background waves */}
                        <WavesIcon className="absolute inset-0 h-7 w-7 text-primary-foreground/20 translate-y-2 translate-x-1" />
                        {/* Main anchor icon */}
                        <svg className="h-7 w-7 text-primary-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="5" r="3"/>
                          <line x1="12" y1="22" x2="12" y2="8"/>
                          <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                        </svg>
                      </div>
                      
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-primary-foreground/30 to-transparent rounded-full" />
                    </div>
                  </div>
                </>
              )}
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
                { to: "/stores", label: "Store Locator" },
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
                { to: "/imprint", label: "Imprint" },
                { to: "/warranty", label: "Warranty" },
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
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              {siteConfig?.footerText || `© ${currentYear} YachtBeach. All rights reserved.`}
            </p>

            {/* Payment Cards - Right Side */}
            <div className="flex items-center gap-4">
              {/* Visa */}
              <motion.div
                whileHover={{ scale: 1.15, y: -4 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-blue-600/0 blur-xl rounded-lg group-hover:bg-blue-600/40 transition-all duration-300" />
                <div className="relative w-16 h-11 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 48 16" className="w-12 h-auto grayscale group-hover:grayscale-0 transition-all duration-300">
                    <path d="M19.5 3.4l-3.8 9.2h-2.4l-1.9-7.3c-.1-.4-.2-.5-.6-.7-.6-.3-1.6-.5-2.5-.7l.1-.2h4.3c.5 0 1 .4 1.1.9l1 5.4 2.5-6.3h2.4zm9.4 6.2c0-2.4-3.4-2.6-3.4-3.7 0-.3.3-.7 1-.8.3-.1 1.2-.1 2.2.4l.4-1.8c-.5-.2-1.3-.4-2.2-.4-2.3 0-4 1.2-4 3 0 1.3 1.2 2 2.1 2.4.9.4 1.3.7 1.3 1.1 0 .6-.7.8-1.4.8-1.2 0-1.8-.3-2.4-.5l-.4 2c.5.2 1.5.4 2.5.4 2.5 0 4.1-1.2 4.1-3.1zm6.3 3h2.1l-1.8-9.2h-1.9c-.4 0-.8.3-.9.7l-3.4 8.5h2.4l.5-1.3h3l.3 1.3zm-2.6-3.1l1.2-3.4.7 3.4h-1.9zm-9.5-6.1l-1.9 9.2h-2.3l1.9-9.2h2.3z" fill="#1434CB" className="group-hover:fill-[#1434CB]"/>
                  </svg>
                </div>
              </motion.div>

              {/* Mastercard */}
              <motion.div
                whileHover={{ scale: 1.15, y: -4 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-orange-600/0 blur-xl rounded-lg group-hover:bg-orange-600/40 transition-all duration-300" />
                <div className="relative w-16 h-11 rounded-lg flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-muted-foreground group-hover:bg-[#EB001B] transition-all duration-300" />
                    <div className="w-6 h-6 rounded-full bg-muted-foreground/60 group-hover:bg-[#F79E1B] transition-all duration-300 -ml-3" />
                  </div>
                </div>
              </motion.div>

              {/* American Express */}
              <motion.div
                whileHover={{ scale: 1.15, y: -4 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-blue-500/0 blur-xl rounded-lg group-hover:bg-blue-500/40 transition-all duration-300" />
                <div className="relative w-16 h-11 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://cdn.hercules.app/file_Z6GbPV94QjeHbH7lprqdiYP5" 
                    alt="American Express" 
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-40 group-hover:opacity-100"
                  />
                </div>
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
