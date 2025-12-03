import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    stripeCustomerId: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    })),
  }).index("by_token", ["tokenIdentifier"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.number(),
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    images: v.array(v.string()),
    stock: v.number(),
    sku: v.optional(v.string()),
    featured: v.boolean(),
    active: v.boolean(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    specifications: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
    dimensions: v.optional(v.object({
      length: v.number(),
      width: v.number(),
      height: v.number(),
      unit: v.string(),
    })),
    weight: v.optional(v.object({
      value: v.number(),
      unit: v.string(),
    })),
    relatedProducts: v.optional(v.array(v.id("products"))),
  }).index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_featured", ["featured"]),

  reviews: defineTable({
    productId: v.id("products"),
    userId: v.optional(v.id("users")),
    userName: v.string(),
    userEmail: v.string(),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
    verifiedPurchase: v.boolean(),
    helpfulCount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  }).index("by_product", ["productId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_product_and_status", ["productId", "status"]),

  cart: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_user_and_product", ["userId", "productId"]),

  orders: defineTable({
    userId: v.optional(v.id("users")),
    guestEmail: v.optional(v.string()),
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    total: v.number(),
    subtotal: v.number(),
    shippingCost: v.number(),
    shippingMethodId: v.id("shippingMethods"),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
      phone: v.string(),
    }),
    stripePaymentIntentId: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_order_number", ["orderNumber"])
    .index("by_status", ["status"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    productImage: v.string(),
    quantity: v.number(),
    price: v.number(),
  }).index("by_order", ["orderId"]),

  shippingMethods: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    estimatedDays: v.string(),
    active: v.boolean(),
    order: v.number(),
  }),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  stripeConfig: defineTable({
    publishableKey: v.string(),
    secretKey: v.string(),
    webhookSecret: v.optional(v.string()),
    isTestMode: v.boolean(),
  }),

  mediaLibrary: defineTable({
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    uploadedBy: v.id("users"),
    tags: v.optional(v.array(v.string())),
    alt: v.optional(v.string()),
  }).index("by_user", ["uploadedBy"]),

  siteConfig: defineTable({
    siteName: v.string(),
    siteDescription: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    faviconStorageId: v.optional(v.id("_storage")),
    primaryColor: v.string(),
    secondaryColor: v.string(),
    socialLinks: v.object({
      facebook: v.optional(v.string()),
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      youtube: v.optional(v.string()),
    }),
    contactInfo: v.object({
      email: v.string(),
      phone: v.string(),
      address: v.string(),
    }),
    footerText: v.string(),
  }),

  seoSettings: defineTable({
    defaultTitle: v.string(),
    defaultDescription: v.string(),
    defaultKeywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    googleAnalyticsId: v.optional(v.string()),
    googleTagManagerId: v.optional(v.string()),
    facebookPixelId: v.optional(v.string()),
  }),

  wishlist: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  }).index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
});
