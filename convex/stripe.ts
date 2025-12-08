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

export const createCheckoutSession = action({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args): Promise<{ url: string | null }> => {
    const stripe = getStripe();
    
    // Get order details
    const order = await ctx.runQuery(internal.orders.getOrderForCheckout, {
      orderId: args.orderId,
    }) as {
      items: Array<{ productName: string; productImage: string; price: number; quantity: number }>;
      shippingCost: number;
      shippingMethod: { name: string } | null;
      user: { email?: string } | null;
    } | null;

    if (!order) {
      throw new Error("Order not found");
    }

    // Get the full order with orderId to pass to metadata
    const fullOrder = await ctx.runQuery(internal.orders.getById, {
      orderId: args.orderId,
    }) as { _id: string; guestEmail?: string } | null;
    
    if (!fullOrder) {
      throw new Error("Full order data not found");
    }

    // Create line items from order items
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: {
          name: string;
          images?: string[];
          description?: string;
        };
        unit_amount: number;
      };
      quantity: number;
    }> = order.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName,
          images: [item.productImage],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (order.shippingCost > 0 && order.shippingMethod) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Shipping Cost",
            description: order.shippingMethod.name,
          },
          unit_amount: Math.round(order.shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Determine customer email
    const customerEmail = order.user?.email || fullOrder.guestEmail;

    // Create checkout session
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.SITE_URL || "http://localhost:5173"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || "http://localhost:5173"}/checkout/cancel`,
      metadata: {
        orderId: fullOrder._id,
      },
      customer_email: customerEmail,
      payment_intent_data: {
        metadata: {
          orderId: fullOrder._id,
        },
      },
    });

    // Update order with payment intent
    await ctx.runMutation(internal.orders.updatePaymentIntent, {
      orderId: args.orderId,
      paymentIntentId: session.payment_intent as string,
    });

    return { url: session.url };
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
