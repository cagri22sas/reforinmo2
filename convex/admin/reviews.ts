import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ConvexError } from "convex/values";

// Get all reviews (admin only)
export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Unauthorized",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Forbidden: Admin access required",
        code: "FORBIDDEN",
      });
    }

    let reviews;
    if (args.status) {
      reviews = await ctx.db
        .query("reviews")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      reviews = await ctx.db.query("reviews").order("desc").collect();
    }

    // Get product info for each review
    const reviewsWithProduct = await Promise.all(
      reviews.map(async (review) => {
        const product = await ctx.db.get(review.productId);
        return {
          ...review,
          productName: product?.name || "Unknown Product",
        };
      })
    );

    return reviewsWithProduct;
  },
});

// Update review status (admin only)
export const updateStatus = mutation({
  args: {
    reviewId: v.id("reviews"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Unauthorized",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Forbidden: Admin access required",
        code: "FORBIDDEN",
      });
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) {
      throw new ConvexError({
        message: "Review not found",
        code: "NOT_FOUND",
      });
    }

    await ctx.db.patch(args.reviewId, {
      status: args.status,
    });
  },
});

// Delete review (admin only)
export const remove = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Unauthorized",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Forbidden: Admin access required",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.delete(args.reviewId);
  },
});
