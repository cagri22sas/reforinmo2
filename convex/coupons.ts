import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { ConvexError } from "convex/values";

export const validate = query({
  args: { code: v.string(), orderAmount: v.number() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!coupon) {
      throw new ConvexError({
        message: "Invalid coupon code",
        code: "NOT_FOUND",
      });
    }

    if (!coupon.active) {
      throw new ConvexError({
        message: "This coupon is no longer active",
        code: "BAD_REQUEST",
      });
    }

    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      throw new ConvexError({
        message: "This coupon has expired",
        code: "BAD_REQUEST",
      });
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      throw new ConvexError({
        message: "This coupon has reached its usage limit",
        code: "BAD_REQUEST",
      });
    }

    if (
      coupon.minOrderAmount !== undefined &&
      args.orderAmount < coupon.minOrderAmount
    ) {
      throw new ConvexError({
        message: `Minimum order amount of €${coupon.minOrderAmount.toFixed(2)} required`,
        code: "BAD_REQUEST",
      });
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = (args.orderAmount * coupon.value) / 100;
      if (
        coupon.maxDiscountAmount !== undefined &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.value;
    }

    return {
      valid: true,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
      discountAmount,
    };
  },
});

export const incrementUsage = mutation({
  args: { couponId: v.id("coupons") },
  handler: async (ctx, args) => {
    const coupon = await ctx.db.get(args.couponId);
    if (!coupon) {
      throw new ConvexError({
        message: "Coupon not found",
        code: "NOT_FOUND",
      });
    }

    await ctx.db.patch(args.couponId, {
      usageCount: coupon.usageCount + 1,
    });
  },
});
