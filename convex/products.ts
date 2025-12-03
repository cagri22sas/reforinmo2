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

export const getRelated = query({
  args: { 
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;
    const product = await ctx.db.get(args.productId);
    
    if (!product) {
      return [];
    }

    // First, check if product has manually set related products
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      const relatedProducts = await Promise.all(
        product.relatedProducts.slice(0, limit).map(async (id) => {
          const relatedProduct = await ctx.db.get(id);
          if (!relatedProduct || !relatedProduct.active) return null;
          const category = await ctx.db.get(relatedProduct.categoryId);
          return { ...relatedProduct, category };
        })
      );
      return relatedProducts.filter((p) => p !== null);
    }

    // Otherwise, get products from the same category
    const categoryProducts = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", product.categoryId))
      .filter((q) => 
        q.and(
          q.eq(q.field("active"), true),
          q.neq(q.field("_id"), args.productId)
        )
      )
      .take(limit);

    return await Promise.all(
      categoryProducts.map(async (p) => {
        const category = await ctx.db.get(p.categoryId);
        return { ...p, category };
      })
    );
  },
});
