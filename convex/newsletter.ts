import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new ConvexError({
        message: "Please enter a valid email address",
        code: "BAD_REQUEST",
      });
    }

    // Check if email already exists
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      // If previously unsubscribed, reactivate
      if (existing.status === "unsubscribed") {
        await ctx.db.patch(existing._id, {
          status: "active",
          name: args.name || existing.name,
        });
        return { message: "Welcome back! You're now subscribed to our newsletter." };
      }
      // Already subscribed
      return { message: "You're already subscribed to our newsletter!" };
    }

    // Create new subscription
    await ctx.db.insert("newsletterSubscribers", {
      email: args.email.toLowerCase(),
      name: args.name,
      status: "active",
      source: args.source || "website",
    });

    return { message: "Thank you for subscribing to our newsletter!" };
  },
});

// Unsubscribe from newsletter
export const unsubscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!subscriber) {
      throw new ConvexError({
        message: "Email not found in our newsletter list",
        code: "NOT_FOUND",
      });
    }

    if (subscriber.status === "unsubscribed") {
      return { message: "You're already unsubscribed from our newsletter." };
    }

    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
    });

    return { message: "You've been successfully unsubscribed from our newsletter." };
  },
});

// Check if email is subscribed
export const checkSubscription = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    return {
      isSubscribed: subscriber?.status === "active",
      status: subscriber?.status || null,
    };
  },
});
