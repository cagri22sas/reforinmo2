import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all subscribers (admin only)
export const listSubscribers = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("unsubscribed"))),
  },
  handler: async (ctx, args) => {
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    if (args.status) {
      return await ctx.db
        .query("newsletterSubscribers")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("newsletterSubscribers")
      .order("desc")
      .collect();
  },
});

// Get subscriber stats (admin only)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    const allSubscribers = await ctx.db
      .query("newsletterSubscribers")
      .collect();

    const activeCount = allSubscribers.filter((s) => s.status === "active").length;
    const unsubscribedCount = allSubscribers.filter((s) => s.status === "unsubscribed").length;

    return {
      total: allSubscribers.length,
      active: activeCount,
      unsubscribed: unsubscribedCount,
    };
  },
});

// Delete subscriber (admin only)
export const deleteSubscriber = mutation({
  args: { id: v.id("newsletterSubscribers") },
  handler: async (ctx, args) => {
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.delete(args.id);
  },
});

// Update subscriber status (admin only)
export const updateStatus = mutation({
  args: {
    id: v.id("newsletterSubscribers"),
    status: v.union(v.literal("active"), v.literal("unsubscribed")),
  },
  handler: async (ctx, args) => {
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
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
