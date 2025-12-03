import { v, ConvexError } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./helpers";

export const create = mutation({
  args: {
    shippingMethodId: v.id("shippingMethods"),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
      phone: v.string(),
    }),
    notes: v.optional(v.string()),
    guestEmail: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    couponCode: v.optional(v.string()),
    discount: v.optional(v.number()),
    couponId: v.optional(v.id("coupons")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let userId = undefined;
    let guestEmail = undefined;
    let sessionId = undefined;
    
    if (identity) {
      // Authenticated user
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
      
      if (!user) {
        throw new ConvexError({
          message: "User not found",
          code: "NOT_FOUND",
        });
      }
      userId = user._id;
    } else {
      // Guest user
      if (!args.guestEmail) {
        throw new ConvexError({
          message: "Email required for guest checkout",
          code: "BAD_REQUEST",
        });
      }
      guestEmail = args.guestEmail;
      sessionId = args.sessionId;
    }

    // Get cart items
    let cartItems;
    if (userId) {
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    } else if (sessionId) {
      cartItems = await ctx.db
        .query("cart")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .collect();
    } else {
      throw new ConvexError({
        message: "No cart found",
        code: "NOT_FOUND",
      });
    }

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Get shipping method
    const shippingMethod = await ctx.db.get(args.shippingMethodId);
    if (!shippingMethod || !shippingMethod.active) {
      throw new Error("Invalid shipping method");
    }

    // Calculate totals
    let subtotal = 0;
    const items = [];

    for (const cartItem of cartItems) {
      const product = await ctx.db.get(cartItem.productId);
      if (!product || !product.active) {
        throw new Error(`Product not available: ${cartItem.productId}`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(`Not enough stock for: ${product.name}`);
      }

      subtotal += product.price * cartItem.quantity;
      items.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images[0] || "",
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    const shippingCost = shippingMethod.price;
    const discount = args.discount || 0;
    const total = subtotal + shippingCost - discount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId,
      guestEmail,
      orderNumber,
      status: "pending",
      subtotal,
      shippingCost,
      discount: discount > 0 ? discount : undefined,
      couponCode: args.couponCode,
      total,
      shippingMethodId: args.shippingMethodId,
      shippingAddress: args.shippingAddress,
      notes: args.notes,
    });

    // Increment coupon usage if applied
    if (args.couponId) {
      const coupon = await ctx.db.get(args.couponId);
      if (coupon) {
        await ctx.db.patch(args.couponId, {
          usageCount: coupon.usageCount + 1,
        });
      }
    }

    // Create order items
    for (const item of items) {
      await ctx.db.insert("orderItems", {
        orderId,
        ...item,
      });
    }

    // Clear cart
    for (const cartItem of cartItems) {
      await ctx.db.delete(cartItem._id);
    }

    return orderId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return orders;
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== user._id) {
      throw new Error("Order not found");
    }

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    const shippingMethod = await ctx.db.get(order.shippingMethodId);

    return {
      ...order,
      items,
      shippingMethod,
    };
  },
});

// Internal queries and mutations for Stripe
export const getOrderForCheckout = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      return null;
    }

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    const shippingMethod = await ctx.db.get(order.shippingMethodId);
    const user = order.userId ? await ctx.db.get(order.userId) : null;

    return {
      ...order,
      items,
      shippingMethod,
      user,
    };
  },
});

export const updatePaymentIntent = internalMutation({
  args: {
    orderId: v.id("orders"),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      stripePaymentIntentId: args.paymentIntentId,
    });
  },
});

export const handleSuccessfulPayment = internalMutation({
  args: {
    orderId: v.string(),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderId))
      .unique();

    if (!order) {
      console.error("Order not found:", args.orderId);
      return;
    }

    // Update order status
    await ctx.db.patch(order._id, {
      status: "processing",
      stripePaymentIntentId: args.paymentIntentId,
    });

    // Reduce stock for each item
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();

    for (const item of items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          stock: Math.max(0, product.stock - item.quantity),
        });
      }
    }
  },
});

export const handleFailedPayment = internalMutation({
  args: {
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find order with this payment intent
    const orders = await ctx.db.query("orders").collect();
    const order = orders.find(
      (o) => o.stripePaymentIntentId === args.paymentIntentId,
    );

    if (order) {
      await ctx.db.patch(order._id, {
        status: "cancelled",
      });
    }
  },
});
