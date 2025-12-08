"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import Stripe from "stripe";

export const handleWebhook = internalAction({
  args: {
    body: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    let event: Stripe.Event;
    
    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(args.body, args.signature, webhookSecret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata?.orderId) {
          throw new Error("No orderId in metadata");
        }

        if (!session.payment_intent) {
          throw new Error("No payment_intent in session");
        }

        await ctx.runMutation(internal.orders.handleSuccessfulPayment, {
          orderId: session.metadata.orderId,
          paymentIntentId: session.payment_intent as string,
        });
        
        console.log("Payment successful for order", session.metadata.orderId);
        break;
      }
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await ctx.runMutation(internal.orders.handleFailedPayment, {
          paymentIntentId: paymentIntent.id,
        });
        
        console.log("Payment failed for intent", paymentIntent.id);
        break;
      }
      
      default:
        console.log("Unhandled event type", event.type);
    }

    return { success: true };
  },
});
