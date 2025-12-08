"use node";

import { v } from "convex/values";
import Stripe from "stripe";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new Stripe(apiKey, {
    apiVersion: "2025-11-17.clover",
  });
};

export const createPaymentIntent = action({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args): Promise<{ clientSecret: string }> => {
    const stripe = getStripe();
    
    // Get order details
    const order = await ctx.runQuery(internal.orders.getOrderForCheckout, {
      orderId: args.orderId,
    }) as {
      total: number;
      guestEmail?: string;
      user: { email?: string } | null;
    } | null;

    if (!order) {
      throw new Error("Order not found");
    }

    const fullOrder = await ctx.runQuery(internal.orders.getById, {
      orderId: args.orderId,
    }) as { _id: string; total: number; guestEmail?: string } | null;
    
    if (!fullOrder) {
      throw new Error("Full order data not found");
    }

    // Check minimum order amount (Stripe requires minimum 50 cents)
    if (fullOrder.total < 0.50) {
      throw new Error("Minimum order amount is €0.50");
    }

    // Determine customer email
    const customerEmail = order.user?.email || fullOrder.guestEmail;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fullOrder.total * 100), // Convert to cents
      currency: "eur",
      metadata: {
        orderId: fullOrder._id,
      },
      receipt_email: customerEmail,
    });

    // Update order with payment intent
    await ctx.runMutation(internal.orders.updatePaymentIntent, {
      orderId: args.orderId,
      paymentIntentId: paymentIntent.id,
    });

    return { clientSecret: paymentIntent.client_secret! };
  },
});

export const confirmPayment = action({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    // Mark the payment as successful
    await ctx.runMutation(internal.orders.handleSuccessfulPayment, {
      orderId: args.orderId as string,
      paymentIntentId: "", // Will be set from metadata
    });

    return { success: true };
  },
});

export const createCustomer = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stripe = getStripe();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const customer = await stripe.customers.create({
      email: args.email,
      name: args.name,
    });

    await ctx.runMutation(internal.users.updateStripeCustomer, {
      tokenIdentifier: identity.tokenIdentifier,
      customerId: customer.id,
    });

    return { customerId: customer.id };
  },
});
