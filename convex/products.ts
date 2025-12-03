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
          
          // Use images field if available, otherwise convert imageStorageIds to URLs
          let images: string[] = [];
          if (relatedProduct.images && relatedProduct.images.length > 0) {
            images = relatedProduct.images;
          } else if (relatedProduct.imageStorageIds && relatedProduct.imageStorageIds.length > 0) {
            const imageUrls = await Promise.all(
              relatedProduct.imageStorageIds.map((id) => ctx.storage.getUrl(id))
            );
            images = imageUrls.filter((url) => url !== null) as string[];
          }
          
          return { ...relatedProduct, category, images };
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
        
        // Use images field if available, otherwise convert imageStorageIds to URLs
        let images: string[] = [];
        if (p.images && p.images.length > 0) {
          images = p.images;
        } else if (p.imageStorageIds && p.imageStorageIds.length > 0) {
          const imageUrls = await Promise.all(
            p.imageStorageIds.map((id) => ctx.storage.getUrl(id))
          );
          images = imageUrls.filter((url) => url !== null) as string[];
        }
        
        return { ...p, category, images };
      })
    );
  },
});

export const search = query({
  args: {
    searchQuery: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    inStock: v.optional(v.boolean()),
    sortBy: v.optional(v.union(
      v.literal("price_asc"),
      v.literal("price_desc"),
      v.literal("name_asc"),
      v.literal("name_desc"),
      v.literal("newest")
    )),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    // Filter by category
    if (args.categoryId) {
      products = products.filter((p) => p.categoryId === args.categoryId);
    }

    // Filter by search query
    if (args.searchQuery && args.searchQuery.trim()) {
      const query = args.searchQuery.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (args.minPrice !== undefined) {
      products = products.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= args.maxPrice!);
    }

    // Filter by stock
    if (args.inStock) {
      products = products.filter((p) => p.stock > 0);
    }

    // Sort products
    if (args.sortBy === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (args.sortBy === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (args.sortBy === "name_asc") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (args.sortBy === "name_desc") {
      products.sort((a, b) => b.name.localeCompare(a.name));
    } else if (args.sortBy === "newest") {
      products.sort((a, b) => b._creationTime - a._creationTime);
    }

    // Add category info
    return await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        
        // Get review stats
        const reviews = await ctx.db
          .query("reviews")
          .withIndex("by_product_and_status", (q) =>
            q.eq("productId", product._id).eq("status", "approved")
          )
          .collect();

        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

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

        return { 
          ...product, 
          category,
          reviewCount: reviews.length,
          averageRating: avgRating,
          images,
        };
      })
    );
  },
});
