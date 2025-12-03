import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "es";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "yachtbeach-language",
    }
  )
);

// Translation helper
export const translations = {
  en: {
    // Legal pages
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    imprint: "Imprint",
    warranty: "Warranty",
    
    // Navigation
    home: "Home",
    products: "Products",
    about: "About Us",
    contact: "Contact",
    stores: "Store Locator",
    
    // Footer
    quickLinks: "Quick Links",
    customerService: "Customer Service",
    legal: "Legal",
    stayConnected: "Stay Connected",
    allRightsReserved: "All rights reserved",
    
    // Language selector
    language: "Language",
    english: "English",
    spanish: "Spanish",
  },
  es: {
    // Legal pages
    privacy: "Política de Privacidad",
    terms: "Términos de Servicio",
    imprint: "Aviso Legal",
    warranty: "Garantía",
    
    // Navigation
    home: "Inicio",
    products: "Productos",
    about: "Sobre Nosotros",
    contact: "Contacto",
    stores: "Localizador de Tiendas",
    
    // Footer
    quickLinks: "Enlaces Rápidos",
    customerService: "Servicio al Cliente",
    legal: "Legal",
    stayConnected: "Mantente Conectado",
    allRightsReserved: "Todos los derechos reservados",
    
    // Language selector
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
  },
};

export const getPageSlug = (basePage: string, language: Language): string => {
  const slugs: Record<string, Record<Language, string>> = {
    privacy: { en: "privacy", es: "privacidad" },
    terms: { en: "terms", es: "terminos" },
    imprint: { en: "imprint", es: "aviso-legal" },
    warranty: { en: "warranty", es: "garantia" },
  };
  
  return slugs[basePage]?.[language] || basePage;
};
