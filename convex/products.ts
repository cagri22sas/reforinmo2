import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products;

    if (args.categoryId) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!))
        .filter((q) => q.eq(q.field("active"), true))
        .collect();
    } else if (args.featured) {
      products = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .filter((q) => q.eq(q.field("active"), true))
        .collect();
    } else {
      products = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("active"), true))
        .collect();
    }

    return await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return { ...product, category };
      }),
    );
  },
});

export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!product) {
      return null;
    }

    const category = await ctx.db.get(product.categoryId);
    return { ...product, category };
  },
});
