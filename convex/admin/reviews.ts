import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";

// Admin query to get all reviews (including pending)
export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const reviews = args.status
      ? await ctx.db
          .query("reviews")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .take(100)
      : await ctx.db.query("reviews").order("desc").take(100);

    return await Promise.all(
      reviews.map(async (review) => {
        const product = await ctx.db.get(review.productId);
        const user = review.userId ? await ctx.db.get(review.userId) : null;
        return { ...review, product, user };
      })
    );
  },
});

// Approve review
export const approve = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.patch(args.reviewId, {
      status: "approved",
    });
  },
});

// Reject review
export const reject = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.patch(args.reviewId, {
      status: "rejected",
    });
  },
});

// Delete review
export const remove = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.delete(args.reviewId);
  },
});

// Get review stats
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const allReviews = await ctx.db.query("reviews").collect();

    const pending = allReviews.filter(r => r.status === "pending").length;
    const approved = allReviews.filter(r => r.status === "approved").length;
    const rejected = allReviews.filter(r => r.status === "rejected").length;

    return {
      total: allReviews.length,
      pending,
      approved,
      rejected,
    };
  },
});
