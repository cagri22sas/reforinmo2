import { v } from "convex/values";
import { query } from "./_generated/server";

// Get published page by slug (public)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!page || !page.published) {
      return null;
    }

    return page;
  },
});
