import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ConvexError } from "convex/values";

// Get site configuration
export const get = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("siteConfig").first();
    
    if (!config) {
      return null;
    }

    // Get logo URL if exists
    let logoUrl = null;
    if (config.logoStorageId) {
      logoUrl = await ctx.storage.getUrl(config.logoStorageId);
    }

    // Get favicon URL if exists
    let faviconUrl = null;
    if (config.faviconStorageId) {
      faviconUrl = await ctx.storage.getUrl(config.faviconStorageId);
    }

    return {
      ...config,
      logoUrl,
      faviconUrl,
    };
  },
});

// Update site configuration
export const update = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmalısınız",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Bu işlem için yetkiniz yok",
        code: "FORBIDDEN",
      });
    }

    const existingConfig = await ctx.db.query("siteConfig").first();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, args);
      return existingConfig._id;
    } else {
      return await ctx.db.insert("siteConfig", args);
    }
  },
});

// Generate upload URL for logo/favicon
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmalısınız",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Bu işlem için yetkiniz yok",
        code: "FORBIDDEN",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Initialize default configuration
export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmalısınız",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Bu işlem için yetkiniz yok",
        code: "FORBIDDEN",
      });
    }

    const existingConfig = await ctx.db.query("siteConfig").first();
    if (existingConfig) {
      return existingConfig._id;
    }

    return await ctx.db.insert("siteConfig", {
      siteName: "Yacht Beach Store",
      siteDescription: "Premium yat ve deniz ürünleri mağazası",
      primaryColor: "#0066CC",
      secondaryColor: "#00AAFF",
      socialLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
      },
      contactInfo: {
        email: "info@yachtbeach.com",
        phone: "+90 555 123 4567",
        address: "İstanbul, Türkiye",
      },
      footerText: "© 2025 Yacht Beach. Tüm hakları saklıdır.",
    });
  },
});
