import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";
import { ConvexError } from "convex/values";

// Get all pages
export const list = query({
  args: { language: v.optional(v.union(v.literal("en"), v.literal("es"))) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    if (args.language) {
      return await ctx.db
        .query("pages")
        .withIndex("by_language", (q) => q.eq("language", args.language as "en" | "es"))
        .order("desc")
        .collect();
    }

    return await ctx.db.query("pages").order("desc").collect();
  },
});

// Get single page
export const get = query({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    return await ctx.db.get(args.id);
  },
});

// Create page
export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    metaDescription: v.optional(v.string()),
    published: v.boolean(),
    language: v.union(v.literal("en"), v.literal("es")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    // Check if slug and language combination already exists
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug_and_language", (q) => 
        q.eq("slug", args.slug).eq("language", args.language)
      )
      .unique();

    if (existing) {
      throw new ConvexError({
        message: "A page with this slug and language already exists",
        code: "CONFLICT",
      });
    }

    return await ctx.db.insert("pages", args);
  },
});

// Update page
export const update = mutation({
  args: {
    id: v.id("pages"),
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    metaDescription: v.optional(v.string()),
    published: v.boolean(),
    language: v.union(v.literal("en"), v.literal("es")),
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

    // Check if slug and language combination is being changed and if it conflicts
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug_and_language", (q) => 
        q.eq("slug", args.slug).eq("language", args.language)
      )
      .unique();

    if (existing && existing._id !== id) {
      throw new ConvexError({
        message: "A page with this slug and language already exists",
        code: "CONFLICT",
      });
    }

    await ctx.db.patch(id, data);
  },
});

// Delete page
export const remove = mutation({
  args: { id: v.id("pages") },
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
