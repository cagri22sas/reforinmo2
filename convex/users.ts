import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (existingUser) {
      return existingUser;
    }

    // Check if this is the first user
    const allUsers = await ctx.db.query("users").collect();
    const isFirstUser = allUsers.length === 0;

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      role: isFirstUser ? "admin" : "user",
    });

    return await ctx.db.get(userId);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    return user?.role === "admin";
  },
});

export const updateStripeCustomer = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        stripeCustomerId: args.customerId,
      });
    }
  },
});
