import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Shopping cart queries and mutations supporting guest users
export const get = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let cartItems;
    
    if (identity) {
      // Authenticated user
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();

      if (!user) {
        return [];
      }
      
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
    } else if (args.sessionId) {
      // Guest user with session
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return [];
    }

    // Get full product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product || !product.active) {
          // Return null for invalid products, they'll be filtered out
          return null;
        }
        // Get image URLs
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
          ...item,
          product: {
            ...product,
            images,
          },
        };
      }),
    );

    // Filter out null items (invalid products)
    return itemsWithProducts.filter((item) => item !== null);
  },
});

export const getCount = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let cartItems;
    
    if (identity) {
      // Authenticated user
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();

      if (!user) {
        return 0;
      }
      
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
    } else if (args.sessionId) {
      // Guest user with session
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return 0;
    }

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },
});

export const add = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Check if product exists and is active
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) {
      throw new Error("Product not found or inactive");
    }

    let userId = undefined;
    let sessionId = undefined;
    
    if (identity) {
      // Authenticated user
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
      
      if (user) {
        userId = user._id;
      }
    } else {
      // Guest user
      sessionId = args.sessionId;
      if (!sessionId) {
        throw new Error("Session ID required for guest users");
      }
    }

    // Check if item already in cart
    let existing;
    if (userId) {
      existing = await ctx.db
        .query("cart")
        .withIndex("by_user_and_product", (q) =>
          q.eq("userId", userId).eq("productId", args.productId),
        )
        .unique();
    } else if (sessionId) {
      const sessionCart = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .collect();
      existing = sessionCart.find(item => item.productId === args.productId);
    }

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
        userId,
        sessionId,
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
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Verify ownership
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
      
      if (!user || cartItem.userId !== user._id) {
        throw new Error("Cart item not found");
      }
    } else {
      if (!args.sessionId || cartItem.sessionId !== args.sessionId) {
        throw new Error("Cart item not found");
      }
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
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    
    // Verify ownership
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
      
      if (!user || cartItem.userId !== user._id) {
        throw new Error("Cart item not found");
      }
    } else {
      if (!args.sessionId || cartItem.sessionId !== args.sessionId) {
        throw new Error("Cart item not found");
      }
    }

    await ctx.db.delete(args.cartItemId);
  },
});

export const clear = mutation({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let cartItems;
    
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
      
      if (!user) {
        return;
      }

      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
    } else if (args.sessionId) {
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return;
    }

    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));
  },
});
