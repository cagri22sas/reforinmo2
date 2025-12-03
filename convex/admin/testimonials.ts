import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all testimonials (admin only)
export const list = query({
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

    return await ctx.db.query("testimonials").order("asc").collect();
  },
});

// Create testimonial
export const create = mutation({
  args: {
    customerName: v.string(),
    customerRole: v.optional(v.string()),
    customerImage: v.optional(v.string()),
    rating: v.number(),
    testimonial: v.string(),
    featured: v.boolean(),
    active: v.boolean(),
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

    // Get current max order
    const allTestimonials = await ctx.db.query("testimonials").collect();
    const maxOrder = allTestimonials.reduce(
      (max, t) => Math.max(max, t.order),
      0
    );

    return await ctx.db.insert("testimonials", {
      ...args,
      order: maxOrder + 1,
    });
  },
});

// Update testimonial
export const update = mutation({
  args: {
    id: v.id("testimonials"),
    customerName: v.optional(v.string()),
    customerRole: v.optional(v.string()),
    customerImage: v.optional(v.string()),
    rating: v.optional(v.number()),
    testimonial: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    active: v.optional(v.boolean()),
    order: v.optional(v.number()),
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

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Delete testimonial
export const remove = mutation({
  args: { id: v.id("testimonials") },
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
