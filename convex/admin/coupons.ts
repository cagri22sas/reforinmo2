import { v, ConvexError } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getCurrentUser } from "../helpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    return await ctx.db.query("coupons").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed")),
    value: v.number(),
    description: v.optional(v.string()),
    minOrderAmount: v.optional(v.number()),
    maxDiscountAmount: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    // Check if code already exists
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (existing) {
      throw new ConvexError({
        message: "Coupon code already exists",
        code: "CONFLICT",
      });
    }

    // Validate values
    if (args.type === "percentage" && (args.value < 0 || args.value > 100)) {
      throw new ConvexError({
        message: "Percentage must be between 0 and 100",
        code: "BAD_REQUEST",
      });
    }

    if (args.type === "fixed" && args.value < 0) {
      throw new ConvexError({
        message: "Fixed discount must be positive",
        code: "BAD_REQUEST",
      });
    }

    return await ctx.db.insert("coupons", {
      code: args.code.toUpperCase(),
      type: args.type,
      value: args.value,
      description: args.description,
      minOrderAmount: args.minOrderAmount,
      maxDiscountAmount: args.maxDiscountAmount,
      usageLimit: args.usageLimit,
      usageCount: 0,
      expiresAt: args.expiresAt,
      active: args.active,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    type: v.optional(v.union(v.literal("percentage"), v.literal("fixed"))),
    value: v.optional(v.number()),
    description: v.optional(v.string()),
    minOrderAmount: v.optional(v.number()),
    maxDiscountAmount: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    const coupon = await ctx.db.get(args.id);
    if (!coupon) {
      throw new ConvexError({
        message: "Coupon not found",
        code: "NOT_FOUND",
      });
    }

    // If updating code, check if new code already exists
    if (args.code) {
      const newCode = args.code.toUpperCase();
      if (newCode !== coupon.code) {
        const existing = await ctx.db
          .query("coupons")
          .withIndex("by_code", (q) => q.eq("code", newCode))
          .first();

        if (existing) {
          throw new ConvexError({
            message: "Coupon code already exists",
            code: "CONFLICT",
          });
        }
      }
    }

    // Validate values if provided
    const type = args.type || coupon.type;
    const value = args.value !== undefined ? args.value : coupon.value;

    if (type === "percentage" && (value < 0 || value > 100)) {
      throw new ConvexError({
        message: "Percentage must be between 0 and 100",
        code: "BAD_REQUEST",
      });
    }

    if (type === "fixed" && value < 0) {
      throw new ConvexError({
        message: "Fixed discount must be positive",
        code: "BAD_REQUEST",
      });
    }

    await ctx.db.patch(args.id, {
      ...(args.code && { code: args.code.toUpperCase() }),
      ...(args.type && { type: args.type }),
      ...(args.value !== undefined && { value: args.value }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.minOrderAmount !== undefined && { minOrderAmount: args.minOrderAmount }),
      ...(args.maxDiscountAmount !== undefined && { maxDiscountAmount: args.maxDiscountAmount }),
      ...(args.usageLimit !== undefined && { usageLimit: args.usageLimit }),
      ...(args.expiresAt !== undefined && { expiresAt: args.expiresAt }),
      ...(args.active !== undefined && { active: args.active }),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    const coupon = await ctx.db.get(args.id);
    if (!coupon) {
      throw new ConvexError({
        message: "Coupon not found",
        code: "NOT_FOUND",
      });
    }

    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    const coupons = await ctx.db.query("coupons").collect();
    
    return {
      total: coupons.length,
      active: coupons.filter(c => c.active).length,
      totalUsage: coupons.reduce((sum, c) => sum + c.usageCount, 0),
    };
  },
});
