import { v } from "convex/values";
import { query } from "./_generated/server";

// Public query to get active brands
export const list = query({
  args: {},
  handler: async (ctx) => {
    const brands = await ctx.db
      .query("brands")
      .withIndex("by_active", (q) => q.eq("active", true))
      .order("asc")
      .collect();
    
    // Sort by order field
    return brands.sort((a, b) => a.order - b.order);
  },
});
