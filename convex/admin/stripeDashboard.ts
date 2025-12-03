"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import Stripe from "stripe";
import { ConvexError } from "convex/values";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(apiKey, {
    apiVersion: "2025-11-17.clover",
  });
};

// Get recent payments
export const getRecentPayments = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if user is admin
    await ctx.runQuery(internal.helpers.checkIsAdmin, {});

    try {
      const stripe = getStripe();
      const charges = await stripe.charges.list({
        limit: args.limit || 10,
      });

      return {
        data: charges.data.map((charge) => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          description: charge.description,
          customerEmail: charge.billing_details.email,
          created: charge.created,
          paid: charge.paid,
          refunded: charge.refunded,
          receiptUrl: charge.receipt_url,
        })),
        hasMore: charges.has_more,
      };
    } catch (error) {
      throw new ConvexError({
        message: error instanceof Error ? error.message : "Failed to fetch payments",
        code: "EXTERNAL_SERVICE_ERROR",
      });
    }
  },
});

// Get dashboard statistics
export const getDashboardStats = action({
  args: {},
  handler: async (ctx) => {
    // Check if user is admin
    await ctx.runQuery(internal.helpers.checkIsAdmin, {});

    try {
      const stripe = getStripe();
      
      // Get balance
      const balance = await stripe.balance.retrieve();
      
      // Get recent charges for statistics
      const charges = await stripe.charges.list({ limit: 100 });
      
      // Get customers count
      const customers = await stripe.customers.list({ limit: 1 });
      
      // Calculate statistics
      const totalRevenue = charges.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + c.amount, 0);
      
      const successfulPayments = charges.data.filter((c) => c.paid).length;
      const failedPayments = charges.data.filter((c) => !c.paid && c.status === "failed").length;
      const refundedPayments = charges.data.filter((c) => c.refunded).length;

      return {
        availableBalance: balance.available[0]?.amount || 0,
        pendingBalance: balance.pending[0]?.amount || 0,
        currency: balance.available[0]?.currency || "try",
        totalRevenue,
        totalPayments: charges.data.length,
        successfulPayments,
        failedPayments,
        refundedPayments,
        totalCustomers: customers.data.length,
      };
    } catch (error) {
      throw new ConvexError({
        message: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
        code: "EXTERNAL_SERVICE_ERROR",
      });
    }
  },
});

// Get recent customers
export const getRecentCustomers = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if user is admin
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Authentication required",
        code: "UNAUTHENTICATED",
      });
    }

    // Verify admin role via internal query
    try {
      await ctx.runQuery(internal.helpers.checkIsAdmin, {});
    } catch (error) {
      throw new ConvexError({
        message: "Admin access required",
        code: "FORBIDDEN",
      });
    }

    try {
      const stripe = getStripe();
      const customers = await stripe.customers.list({
        limit: args.limit || 10,
      });

      return {
        data: customers.data.map((customer) => ({
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created,
        })),
        hasMore: customers.has_more,
      };
    } catch (error) {
      throw new ConvexError({
        message: error instanceof Error ? error.message : "Failed to fetch customers",
        code: "EXTERNAL_SERVICE_ERROR",
      });
    }
  },
});

// Refund a payment
export const refundPayment = action({
  args: {
    chargeId: v.string(),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if user is admin
    await ctx.runQuery(internal.helpers.checkIsAdmin, {});

    try {
      const stripe = getStripe();
      const refund = await stripe.refunds.create({
        charge: args.chargeId,
        amount: args.amount,
      });

      return {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      };
    } catch (error) {
      throw new ConvexError({
        message: error instanceof Error ? error.message : "Failed to process refund",
        code: "EXTERNAL_SERVICE_ERROR",
      });
    }
  },
});
