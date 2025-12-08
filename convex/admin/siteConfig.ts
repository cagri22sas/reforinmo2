import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ConvexError } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("siteConfig").first();
    
    if (!config) {
      return {
        siteName: "Reforinmo Marine",
        siteDescription: "Premium marine lifestyle products",
        primaryColor: "#0ea5e9",
        secondaryColor: "#0284c7",
        socialLinks: {
          facebook: "",
          instagram: "",
          twitter: "",
          youtube: "",
        },
        contactInfo: {
          email: "info@reforinmomarine.com",
          phone: "+34 661 171 490",
          address: "CALLE URB LOS PINOS, NUM 16 PUERTA C, 03710 CALP - (ALICANTE), Spain",
        },
        footerText: "© 2024 Reforinmo Marine. All rights reserved.",
      };
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

export const update = mutation({
  args: {
    siteName: v.string(),
    siteDescription: v.string(),
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
        message: "Giriş yapmanız gerekiyor",
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

    const existing = await ctx.db.query("siteConfig").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("siteConfig", args);
    }

    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmanız gerekiyor",
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

export const updateLogo = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmanız gerekiyor",
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

    const config = await ctx.db.query("siteConfig").first();

    if (config) {
      await ctx.db.patch(config._id, { logoStorageId: args.storageId });
    } else {
      await ctx.db.insert("siteConfig", {
        siteName: "Reforinmo Marine",
        siteDescription: "Premium marine lifestyle products",
        primaryColor: "#0ea5e9",
        secondaryColor: "#0284c7",
        socialLinks: {},
        contactInfo: {
          email: "info@reforinmomarine.com",
          phone: "+34 661 171 490",
          address: "CALLE URB LOS PINOS, NUM 16 PUERTA C, 03710 CALP - (ALICANTE), Spain",
        },
        footerText: "© 2024 Reforinmo Marine. All rights reserved.",
        logoStorageId: args.storageId,
      });
    }

    return { success: true };
  },
});

export const updateFavicon = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Giriş yapmanız gerekiyor",
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

    const config = await ctx.db.query("siteConfig").first();

    if (config) {
      await ctx.db.patch(config._id, { faviconStorageId: args.storageId });
    } else {
      await ctx.db.insert("siteConfig", {
        siteName: "Reforinmo Marine",
        siteDescription: "Premium marine lifestyle products",
        primaryColor: "#0ea5e9",
        secondaryColor: "#0284c7",
        socialLinks: {},
        contactInfo: {
          email: "info@reforinmomarine.com",
          phone: "+34 661 171 490",
          address: "CALLE URB LOS PINOS, NUM 16 PUERTA C, 03710 CALP - (ALICANTE), Spain",
        },
        footerText: "© 2024 Reforinmo Marine. All rights reserved.",
        faviconStorageId: args.storageId,
      });
    }

    return { success: true };
  },
});
