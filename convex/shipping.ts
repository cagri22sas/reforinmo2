import { v } from "convex/values";
import { query } from "./_generated/server";

export const getActiveMethods = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("shippingMethods")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const calculateShipping = query({
  args: {
    subtotal: v.number(),
    shippingMethodId: v.optional(v.id("shippingMethods")),
  },
  handler: async (ctx, args) => {
    // Get free shipping threshold
    const freeShippingThreshold = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "freeShippingThreshold"))
      .unique();

    const threshold = freeShippingThreshold 
      ? parseFloat(freeShippingThreshold.value) 
      : 0;

    // Check if qualifies for free shipping
    if (threshold > 0 && args.subtotal >= threshold) {
      return {
        cost: 0,
        isFreeShipping: true,
        amountToFreeShipping: 0,
        threshold,
      };
    }

    // Get shipping method cost
    let cost = 0;
    if (args.shippingMethodId) {
      const method = await ctx.db.get(args.shippingMethodId);
      if (method && method.active) {
        cost = method.price;
      }
    }

    const amountToFreeShipping = threshold > 0 ? Math.max(0, threshold - args.subtotal) : 0;

    return {
      cost,
      isFreeShipping: false,
      amountToFreeShipping,
      threshold,
    };
  },
});
