import { v } from "convex/values";
import { query } from "./_generated/server";

// Get published page by slug and language (public)
export const getBySlug = query({
  args: { 
    slug: v.string(),
    language: v.optional(v.union(v.literal("en"), v.literal("es"))),
  },
  handler: async (ctx, args) => {
    const language = args.language || "en";
    
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug_and_language", (q) => 
        q.eq("slug", args.slug).eq("language", language)
      )
      .unique();

    if (!page || !page.published) {
      return null;
    }

    return page;
  },
});
