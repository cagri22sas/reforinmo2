import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";

// Admin query to get all products (including inactive)
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

    const products = await ctx.db.query("products").order("desc").take(100);
    return await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        
        // Use images field if available, otherwise convert imageStorageIds to URLs
        let images: string[] = [];
        if (product.images && product.images.length > 0) {
          images = product.images;
        } else if (product.imageStorageIds && product.imageStorageIds.length > 0) {
          const imageUrls = await Promise.all(
            product.imageStorageIds.map((id) => ctx.storage.getUrl(id))
          );
          images = imageUrls.filter((url) => url !== null) as string[];
        }
        
        return { ...product, category, images };
      }),
    );
  },
});

// Get single product
export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new ConvexError({
        message: "Product not found",
        code: "NOT_FOUND",
      });
    }

    const category = await ctx.db.get(product.categoryId);
    
    // Use images field if available, otherwise convert imageStorageIds to URLs
    let images: string[] = [];
    if (product.images && product.images.length > 0) {
      images = product.images;
    } else if (product.imageStorageIds && product.imageStorageIds.length > 0) {
      const imageUrls = await Promise.all(
        product.imageStorageIds.map((id) => ctx.storage.getUrl(id))
      );
      images = imageUrls.filter((url) => url !== null) as string[];
    }
    
    return { ...product, category, images };
  },
});

// Generate upload URL for product images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    imageStorageIds: v.optional(v.array(v.id("_storage"))),
    images: v.optional(v.array(v.string())),
    stock: v.number(),
    sku: v.optional(v.string()),
    featured: v.boolean(),
    active: v.boolean(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    specifications: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    // Check if slug already exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new ConvexError({
        message: "A product with this slug already exists",
        code: "CONFLICT",
      });
    }

    const productId = await ctx.db.insert("products", args);
    return productId;
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    imageStorageIds: v.optional(v.array(v.id("_storage"))),
    images: v.optional(v.array(v.string())),
    stock: v.number(),
    sku: v.optional(v.string()),
    featured: v.boolean(),
    active: v.boolean(),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.string()),
    specifications: v.optional(v.array(v.object({
      label: v.string(),
      value: v.string(),
    }))),
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

    // Check if slug is being changed and if it conflicts
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing && existing._id !== id) {
      throw new ConvexError({
        message: "A product with this slug already exists",
        code: "CONFLICT",
      });
    }

    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
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

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    // Delete all products
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }

    return { deletedCount: args.ids.length };
  },
});
