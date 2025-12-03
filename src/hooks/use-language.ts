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
    allProducts: "All Products",
    about: "About Us",
    contact: "Contact",
    stores: "Store Locator",
    admin: "Admin",
    
    // Header
    marineExcellence: "Marine Excellence",
    signIn: "Sign In",
    signOut: "Sign Out",
    myOrders: "My Orders",
    myProfile: "My Profile",
    myWishlist: "My Wishlist",
    
    // Footer
    quickLinks: "Quick Links",
    customerService: "Customer Service",
    legal: "Legal",
    stayConnected: "Stay Connected",
    allRightsReserved: "All rights reserved",
    shippingInfo: "Shipping Info",
    returnPolicy: "Return Policy",
    faq: "FAQ",
    newsletterSubscribe: "Subscribe to our newsletter for exclusive offers and updates",
    
    // Language selector
    language: "Language",
    english: "English",
    spanish: "Spanish",
    
    // Homepage
    premiumMarineLifestyle: "PREMIUM MARINE LIFESTYLE",
    heroTitle: "Where Luxury",
    heroTitleHighlight: "Meets the Sea",
    heroDescription: "Experience the ultimate in floating luxury with our handcrafted marine platforms and accessories",
    exploreCollection: "Explore Collection",
    shopCollection: "Shop Collection",
    viewAllProducts: "View All Products",
    
    // Features
    expertConsultation: "Expert Consultation",
    expertConsultationDesc: "Personalized guidance from marine specialists",
    lifetimeWarranty: "Lifetime Warranty",
    lifetimeWarrantyDesc: "Protected investment in quality",
    ecoFriendly: "Eco-Friendly",
    ecoFriendlyDesc: "Sustainable materials & practices",
    fastDelivery: "Fast Delivery",
    fastDeliveryDesc: "Global shipping within 7-14 days",
    
    // Categories
    shopByCategory: "Shop by Category",
    discoverCurated: "Discover our curated collections",
    explore: "Explore",
    
    // Featured Products
    featuredCollection: "Featured Collection",
    featuredDescription: "Handpicked luxury pieces for the discerning water enthusiast",
    noFeaturedProducts: "No featured products available yet.",
    
    // CTA
    exclusiveCollection: "EXCLUSIVE COLLECTION",
    ctaTitle: "Begin Your",
    ctaTitleHighlight: "Journey",
    ctaDescription: "Transform your aquatic experience with our exclusive collection of premium floating platforms",
    secureCheckout: "Secure Checkout",
    premiumQuality: "Premium Quality",
    freeShipping: "Free Shipping",
    
    // Product Card
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    removeFromWishlist: "Remove from Wishlist",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    
    // Cart
    shoppingCart: "Shopping Cart",
    yourCart: "Your Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyDesc: "Add products to your cart to get started",
    startShopping: "Start Shopping",
    remove: "Remove",
    subtotal: "Subtotal",
    total: "Total",
    proceedToCheckout: "Proceed to Checkout",
    continueShopping: "Continue Shopping",
    
    // Checkout
    checkout: "Checkout",
    shippingDetails: "Shipping Details",
    paymentDetails: "Payment Details",
    orderSummary: "Order Summary",
    placeOrder: "Place Order",
    processing: "Processing...",
    
    // Orders
    orders: "Orders",
    orderDetails: "Order Details",
    orderNumber: "Order Number",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    orderTotal: "Order Total",
    trackOrder: "Track Order",
    viewOrder: "View Order",
    noOrders: "No orders yet",
    noOrdersDesc: "Start shopping to place your first order",
    
    // Wishlist
    wishlist: "Wishlist",
    myWishlistTitle: "My Wishlist",
    wishlistEmpty: "Your wishlist is empty",
    wishlistEmptyDesc: "Add products to your wishlist to save them for later",
    moveToCart: "Move to Cart",
    
    // Profile
    profile: "Profile",
    personalInfo: "Personal Information",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    
    // Search & Filters
    search: "Search",
    searchProducts: "Search products...",
    filters: "Filters",
    category: "Category",
    priceRange: "Price Range",
    availability: "Availability",
    rating: "Rating",
    sortBy: "Sort By",
    applyFilters: "Apply Filters",
    clearFilters: "Clear Filters",
    noResults: "No results found",
    noResultsDesc: "Try adjusting your search or filters",
    
    // Reviews
    reviews: "Reviews",
    writeReview: "Write a Review",
    reviewRating: "Rating",
    comment: "Comment",
    submit: "Submit",
    
    // Testimonials
    testimonialsTitle: "What Our Customers Say",
    testimonialsDesc: "Real experiences from our satisfied clients",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    close: "Close",
    yes: "Yes",
    no: "No",
    back: "Back",
    next: "Next",
    previous: "Previous",
    showMore: "Show More",
    showLess: "Show Less",
    readMore: "Read More",
    learnMore: "Learn More",
    
    // Form fields
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number",
    city: "City",
    state: "State",
    zipCode: "ZIP Code",
    country: "Country",
    message: "Message",
    subject: "Subject",
    
    // Errors
    required: "This field is required",
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number",
    errorOccurred: "An error occurred",
    tryAgain: "Please try again",
    
    // Newsletter
    subscribeNewsletter: "Subscribe to Newsletter",
    enterEmail: "Enter your email",
    subscribe: "Subscribe",
    subscribeSuccess: "Successfully subscribed!",
    subscribeError: "Subscription failed",
    
    // Live Chat
    liveChat: "Live Chat",
    startChat: "Start Chat",
    typeMessage: "Type your message...",
    send: "Send",
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
    allProducts: "Todos los Productos",
    about: "Sobre Nosotros",
    contact: "Contacto",
    stores: "Localizador de Tiendas",
    admin: "Administración",
    
    // Header
    marineExcellence: "Excelencia Marina",
    signIn: "Iniciar Sesión",
    signOut: "Cerrar Sesión",
    myOrders: "Mis Pedidos",
    myProfile: "Mi Perfil",
    myWishlist: "Mi Lista de Deseos",
    
    // Footer
    quickLinks: "Enlaces Rápidos",
    customerService: "Servicio al Cliente",
    legal: "Legal",
    stayConnected: "Mantente Conectado",
    allRightsReserved: "Todos los derechos reservados",
    shippingInfo: "Información de Envío",
    returnPolicy: "Política de Devolución",
    faq: "Preguntas Frecuentes",
    newsletterSubscribe: "Suscríbete a nuestro boletín para ofertas exclusivas y actualizaciones",
    
    // Language selector
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    
    // Homepage
    premiumMarineLifestyle: "ESTILO DE VIDA MARINO PREMIUM",
    heroTitle: "Donde el Lujo",
    heroTitleHighlight: "Se Encuentra con el Mar",
    heroDescription: "Experimenta lo último en lujo flotante con nuestras plataformas marinas artesanales y accesorios",
    exploreCollection: "Explorar Colección",
    shopCollection: "Comprar Colección",
    viewAllProducts: "Ver Todos los Productos",
    
    // Features
    expertConsultation: "Consultoría Experta",
    expertConsultationDesc: "Orientación personalizada de especialistas marinos",
    lifetimeWarranty: "Garantía de por Vida",
    lifetimeWarrantyDesc: "Inversión protegida en calidad",
    ecoFriendly: "Ecológico",
    ecoFriendlyDesc: "Materiales y prácticas sostenibles",
    fastDelivery: "Entrega Rápida",
    fastDeliveryDesc: "Envío global en 7-14 días",
    
    // Categories
    shopByCategory: "Comprar por Categoría",
    discoverCurated: "Descubre nuestras colecciones seleccionadas",
    explore: "Explorar",
    
    // Featured Products
    featuredCollection: "Colección Destacada",
    featuredDescription: "Piezas de lujo seleccionadas para el entusiasta del agua exigente",
    noFeaturedProducts: "Aún no hay productos destacados disponibles.",
    
    // CTA
    exclusiveCollection: "COLECCIÓN EXCLUSIVA",
    ctaTitle: "Comienza Tu",
    ctaTitleHighlight: "Viaje",
    ctaDescription: "Transforma tu experiencia acuática con nuestra colección exclusiva de plataformas flotantes premium",
    secureCheckout: "Pago Seguro",
    premiumQuality: "Calidad Premium",
    freeShipping: "Envío Gratis",
    
    // Product Card
    addToCart: "Añadir al Carrito",
    addToWishlist: "Añadir a Lista de Deseos",
    removeFromWishlist: "Quitar de Lista de Deseos",
    outOfStock: "Agotado",
    inStock: "En Stock",
    
    // Cart
    shoppingCart: "Carrito de Compras",
    yourCart: "Tu Carrito",
    cartEmpty: "Tu carrito está vacío",
    cartEmptyDesc: "Añade productos a tu carrito para comenzar",
    startShopping: "Comenzar a Comprar",
    remove: "Eliminar",
    subtotal: "Subtotal",
    total: "Total",
    proceedToCheckout: "Proceder al Pago",
    continueShopping: "Continuar Comprando",
    
    // Checkout
    checkout: "Pagar",
    shippingDetails: "Detalles de Envío",
    paymentDetails: "Detalles de Pago",
    orderSummary: "Resumen del Pedido",
    placeOrder: "Realizar Pedido",
    processing: "Procesando...",
    
    // Orders
    orders: "Pedidos",
    orderDetails: "Detalles del Pedido",
    orderNumber: "Número de Pedido",
    orderDate: "Fecha del Pedido",
    orderStatus: "Estado del Pedido",
    orderTotal: "Total del Pedido",
    trackOrder: "Rastrear Pedido",
    viewOrder: "Ver Pedido",
    noOrders: "Aún no hay pedidos",
    noOrdersDesc: "Comienza a comprar para realizar tu primer pedido",
    
    // Wishlist
    wishlist: "Lista de Deseos",
    myWishlistTitle: "Mi Lista de Deseos",
    wishlistEmpty: "Tu lista de deseos está vacía",
    wishlistEmptyDesc: "Añade productos a tu lista de deseos para guardarlos para más tarde",
    moveToCart: "Mover al Carrito",
    
    // Profile
    profile: "Perfil",
    personalInfo: "Información Personal",
    name: "Nombre",
    email: "Correo Electrónico",
    phone: "Teléfono",
    address: "Dirección",
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    
    // Search & Filters
    search: "Buscar",
    searchProducts: "Buscar productos...",
    filters: "Filtros",
    category: "Categoría",
    priceRange: "Rango de Precio",
    availability: "Disponibilidad",
    rating: "Calificación",
    sortBy: "Ordenar Por",
    applyFilters: "Aplicar Filtros",
    clearFilters: "Limpiar Filtros",
    noResults: "No se encontraron resultados",
    noResultsDesc: "Intenta ajustar tu búsqueda o filtros",
    
    // Reviews
    reviews: "Reseñas",
    writeReview: "Escribir Reseña",
    reviewRating: "Calificación",
    comment: "Comentario",
    submit: "Enviar",
    
    // Testimonials
    testimonialsTitle: "Lo Que Dicen Nuestros Clientes",
    testimonialsDesc: "Experiencias reales de nuestros clientes satisfechos",
    
    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    confirm: "Confirmar",
    close: "Cerrar",
    yes: "Sí",
    no: "No",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    showMore: "Mostrar Más",
    showLess: "Mostrar Menos",
    readMore: "Leer Más",
    learnMore: "Aprender Más",
    
    // Form fields
    firstName: "Nombre",
    lastName: "Apellido",
    phoneNumber: "Número de Teléfono",
    city: "Ciudad",
    state: "Estado",
    zipCode: "Código Postal",
    country: "País",
    message: "Mensaje",
    subject: "Asunto",
    
    // Errors
    required: "Este campo es obligatorio",
    invalidEmail: "Dirección de correo electrónico inválida",
    invalidPhone: "Número de teléfono inválido",
    errorOccurred: "Ocurrió un error",
    tryAgain: "Por favor, inténtalo de nuevo",
    
    // Newsletter
    subscribeNewsletter: "Suscribirse al Boletín",
    enterEmail: "Ingresa tu correo electrónico",
    subscribe: "Suscribirse",
    subscribeSuccess: "¡Suscripción exitosa!",
    subscribeError: "Error en la suscripción",
    
    // Live Chat
    liveChat: "Chat en Vivo",
    startChat: "Iniciar Chat",
    typeMessage: "Escribe tu mensaje...",
    send: "Enviar",
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
