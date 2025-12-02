import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get SEO settings
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("seoSettings").first();
    return settings;
  },
});

// Update or create SEO settings
export const update = mutation({
  args: {
    defaultTitle: v.string(),
    defaultDescription: v.string(),
    defaultKeywords: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    googleAnalyticsId: v.optional(v.string()),
    googleTagManagerId: v.optional(v.string()),
    facebookPixelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user is authenticated and is admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "User does not have permission",
        code: "FORBIDDEN",
      });
    }

    // Check if settings exist
    const existingSettings = await ctx.db.query("seoSettings").first();

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, {
        defaultTitle: args.defaultTitle,
        defaultDescription: args.defaultDescription,
        defaultKeywords: args.defaultKeywords,
        ogImage: args.ogImage,
        twitterHandle: args.twitterHandle,
        googleAnalyticsId: args.googleAnalyticsId,
        googleTagManagerId: args.googleTagManagerId,
        facebookPixelId: args.facebookPixelId,
      });
      return existingSettings._id;
    } else {
      // Create new settings
      return await ctx.db.insert("seoSettings", {
        defaultTitle: args.defaultTitle,
        defaultDescription: args.defaultDescription,
        defaultKeywords: args.defaultKeywords,
        ogImage: args.ogImage,
        twitterHandle: args.twitterHandle,
        googleAnalyticsId: args.googleAnalyticsId,
        googleTagManagerId: args.googleTagManagerId,
        facebookPixelId: args.facebookPixelId,
      });
    }
  },
});
