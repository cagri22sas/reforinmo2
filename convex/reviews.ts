import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel.d.ts";

// Get reviews for a product (approved only)
export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product_and_status", (q) =>
        q.eq("productId", args.productId).eq("status", "approved")
      )
      .order("desc")
      .collect();

    return reviews;
  },
});

// Get review statistics for a product
export const getStats = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product_and_status", (q) =>
        q.eq("productId", args.productId).eq("status", "approved")
      )
      .collect();

    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      };
    }

    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;

    const ratingDistribution = reviews.reduce(
      (dist, review) => {
        dist[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  },
});

// Create a new review
export const create = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    title: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new ConvexError({
        message: "You must be logged in to leave a review",
        code: "UNAUTHENTICATED",
      });
    }

    // Check if user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    // Check if product exists
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new ConvexError({
        message: "Product not found",
        code: "NOT_FOUND",
      });
    }

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new ConvexError({
        message: "Rating must be between 1 and 5",
        code: "BAD_REQUEST",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existingReview) {
      throw new ConvexError({
        message: "You have already reviewed this product",
        code: "CONFLICT",
      });
    }

    // Check if user has purchased this product (verified purchase)
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let verifiedPurchase = false;
    for (const order of orders) {
      const orderItems = await ctx.db
        .query("orderItems")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect();

      if (orderItems.some((item) => item.productId === args.productId)) {
        verifiedPurchase = true;
        break;
      }
    }

    // Create review
    const reviewId = await ctx.db.insert("reviews", {
      productId: args.productId,
      userId: user._id,
      userName: user.name || "Anonymous",
      userEmail: user.email || "",
      rating: args.rating,
      title: args.title,
      comment: args.comment,
      verifiedPurchase,
      helpfulCount: 0,
      status: "approved", // Auto-approve for now
    });

    return reviewId;
  },
});

// Mark review as helpful
export const markHelpful = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    
    if (!review) {
      throw new ConvexError({
        message: "Review not found",
        code: "NOT_FOUND",
      });
    }

    await ctx.db.patch(args.reviewId, {
      helpfulCount: review.helpfulCount + 1,
    });
  },
});
