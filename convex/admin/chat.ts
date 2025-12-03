import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get all conversations
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    const conversations = await ctx.db
      .query("chatConversations")
      .order("desc")
      .collect();

    // Get user details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        let userName = conv.guestName || "Guest";
        let userEmail = conv.guestEmail;

        if (conv.userId) {
          const convUser = await ctx.db.get(conv.userId);
          if (convUser) {
            userName = convUser.name || "User";
            userEmail = convUser.email;
          }
        }

        // Get last message
        const lastMessage = await ctx.db
          .query("chatMessages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();

        return {
          ...conv,
          userName,
          userEmail,
          lastMessage: lastMessage?.message,
        };
      })
    );

    return conversationsWithDetails;
  },
});

// Send admin reply
export const sendAdminReply = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    // Create message
    await ctx.db.insert("chatMessages", {
      conversationId: args.conversationId,
      senderId: user._id,
      senderName: user.name || "Support Team",
      message: args.message,
      isAdmin: true,
    });

    // Update conversation
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
      assignedToId: user._id,
    });
  },
});

// Update conversation status
export const updateStatus = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    status: v.union(
      v.literal("active"),
      v.literal("resolved"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "User not logged in",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || user.role !== "admin") {
      throw new ConvexError({
        message: "Access denied. Admin only.",
        code: "FORBIDDEN",
      });
    }

    await ctx.db.patch(args.conversationId, {
      status: args.status,
    });
  },
});
