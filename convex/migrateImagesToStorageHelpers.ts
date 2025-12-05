import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel.d.ts";

export const getProductsWithExternalImages = internalQuery({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.filter(p => 
      p.images && 
      p.images.length > 0 && 
      p.images.some(img => img.startsWith("http"))
    );
  },
});

export const getCategoriesWithExternalImages = internalQuery({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories.filter(c => 
      c.imageUrl && 
      c.imageUrl.startsWith("http")
    );
  },
});

export const generateUploadUrl = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = internalQuery({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});

export const updateProductImages = internalMutation({
  args: {
    productId: v.id("products"),
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    // Get URLs for the storage IDs
    const imageUrls = await Promise.all(
      args.storageIds.map(id => ctx.storage.getUrl(id))
    );
    
    await ctx.db.patch(args.productId, {
      imageStorageIds: args.storageIds,
      images: imageUrls.filter((url): url is string => url !== null),
    });
  },
});

export const updateCategoryImage = internalMutation({
  args: {
    categoryId: v.id("categories"),
    imageUrl: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    if (args.imageUrl) {
      await ctx.db.patch(args.categoryId, {
        imageUrl: args.imageUrl,
      });
    }
  },
});
