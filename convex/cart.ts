import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./helpers";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return [];
    }
    
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get full product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) {
          return null;
        }
        return {
          ...item,
          product,
        };
      }),
    );

    return itemsWithProducts.filter((item) => item !== null);
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return 0;
    }
    
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

export const add = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    // Check if product exists and is active
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) {
      throw new Error("Product not found or inactive");
    }

    // Check if item already in cart
    const existing = await ctx.db
      .query("cart")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", user._id).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      // Update quantity
      const newQuantity = existing.quantity + args.quantity;
      
      // Check stock
      if (newQuantity > product.stock) {
        throw new Error("Not enough stock available");
      }

      await ctx.db.patch(existing._id, {
        quantity: newQuantity,
      });
      
      return existing._id;
    } else {
      // Check stock
      if (args.quantity > product.stock) {
        throw new Error("Not enough stock available");
      }

      // Add new item
      return await ctx.db.insert("cart", {
        userId: user._id,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new Error("Cart item not found");
    }

    // Check stock
    const product = await ctx.db.get(cartItem.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (args.quantity > product.stock) {
      throw new Error("Not enough stock available");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, {
        quantity: args.quantity,
      });
    }
  },
});

export const remove = mutation({
  args: {
    cartItemId: v.id("cart"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new Error("Cart item not found");
    }

    await ctx.db.delete(args.cartItemId);
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));
  },
});
