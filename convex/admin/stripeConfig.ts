import { v } from "convex/values";
import { mutation, query, internalMutation } from "../_generated/server";
import { ConvexError } from "convex/values";

export const get = query({
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

    const config = await ctx.db.query("stripeConfig").first();
    return config || null;
  },
});

export const update = mutation({
  args: {
    publishableKey: v.string(),
    secretKey: v.string(),
    webhookSecret: v.optional(v.string()),
    isTestMode: v.boolean(),
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

    const existing = await ctx.db.query("stripeConfig").first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("stripeConfig", args);
    }

    return { success: true };
  },
});

export const saveOAuthCredentials = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
    publishableKey: v.string(),
    stripeUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if config exists
    const existingConfig = await ctx.db.query("stripeConfig").first();

    if (existingConfig) {
      // Update existing
      await ctx.db.patch(existingConfig._id, {
        publishableKey: args.publishableKey,
        secretKey: args.accessToken,
        stripeUserId: args.stripeUserId,
        connectedViaOAuth: true,
        isTestMode: args.publishableKey.startsWith("pk_test_"),
      });
    } else {
      // Create new
      await ctx.db.insert("stripeConfig", {
        publishableKey: args.publishableKey,
        secretKey: args.accessToken,
        stripeUserId: args.stripeUserId,
        connectedViaOAuth: true,
        isTestMode: args.publishableKey.startsWith("pk_test_"),
      });
    }
  },
});
