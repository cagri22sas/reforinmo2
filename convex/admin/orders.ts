import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";

export const list = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    )),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const orders = args.status
      ? await ctx.db
          .query("orders")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("orders").order("desc").collect();

    return await Promise.all(
      orders.map(async (order) => {
        const customer = order.userId ? await ctx.db.get(order.userId) : null;
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, customer, itemCount: items.length };
      }),
    );
  },
});

export const get = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new ConvexError({
        message: "Order not found",
        code: "NOT_FOUND",
      });
    }

    const customer = order.userId ? await ctx.db.get(order.userId) : null;
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
    const shippingMethod = await ctx.db.get(order.shippingMethodId);

    return {
      ...order,
      customer,
      items,
      shippingMethod,
    };
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    trackingNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const updateData: {
      status: typeof args.status;
      trackingNumber?: string;
    } = {
      status: args.status,
    };

    if (args.trackingNumber !== undefined) {
      updateData.trackingNumber = args.trackingNumber;
    }

    await ctx.db.patch(args.orderId, updateData);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const orders = await ctx.db.query("orders").collect();
    const products = await ctx.db.query("products").collect();
    const users = await ctx.db.query("users").collect();

    // Calculate revenue
    const totalRevenue = orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);

    // Get pending orders count
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    // Get low stock products
    const lowStockProducts = products.filter(p => p.active && p.stock < 10).length;

    // Recent orders (last 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentOrders = orders.filter(o => o._creationTime > thirtyDaysAgo).length;
    
    // Previous 30 days for comparison
    const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const previousPeriodOrders = orders.filter(
      o => o._creationTime > sixtyDaysAgo && o._creationTime <= thirtyDaysAgo
    ).length;
    
    // Calculate revenue for last 30 days
    const recentRevenue = orders
      .filter(o => o._creationTime > thirtyDaysAgo && o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);
      
    // Previous period revenue
    const previousRevenue = orders
      .filter(o => o._creationTime > sixtyDaysAgo && o._creationTime <= thirtyDaysAgo && o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate trends
    const ordersTrend = previousPeriodOrders > 0 
      ? ((recentOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
      : 0;
    const revenueTrend = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalProducts: products.length,
      totalCustomers: users.length,
      lowStockProducts,
      recentOrders,
      recentRevenue,
      ordersTrend,
      revenueTrend,
    };
  },
});

export const getChartData = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const orders = await ctx.db.query("orders").collect();

    // Last 7 days revenue data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    const revenueByDay = last7Days.map(dayStart => {
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;
      const dayOrders = orders.filter(
        o => o._creationTime >= dayStart && 
             o._creationTime < dayEnd && 
             o.status !== "cancelled"
      );
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        date: new Date(dayStart).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
        revenue: revenue,
        orders: dayOrders.length,
      };
    });

    // Order status breakdown
    const statusCounts = {
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
    };

    return {
      revenueByDay,
      statusCounts,
    };
  },
});
