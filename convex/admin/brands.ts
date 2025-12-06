import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";

// Admin query to get all brands
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const brands = await ctx.db.query("brands").order("asc").collect();
    return brands.sort((a, b) => a.order - b.order);
  },
});

// Create brand
export const create = mutation({
  args: {
    name: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const brandId = await ctx.db.insert("brands", args);
    return brandId;
  },
});

// Update brand
export const update = mutation({
  args: {
    id: v.id("brands"),
    name: v.string(),
    logoUrl: v.string(),
    websiteUrl: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete brand
export const remove = mutation({
  args: { id: v.id("brands") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.delete(args.id);
  },
});
