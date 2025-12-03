import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get or create a conversation for the current user
export const getOrCreateConversation = mutation({
  args: {
    guestEmail: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // If authenticated user
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();

      if (user) {
        // Find existing active conversation
        const existing = await ctx.db
          .query("chatConversations")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .filter((q) => q.eq(q.field("status"), "active"))
          .first();

        if (existing) {
          return existing._id;
        }

        // Create new conversation
        return await ctx.db.insert("chatConversations", {
          userId: user._id,
          status: "active",
          lastMessageAt: Date.now(),
        });
      }
    }

    // Guest user - create conversation with email
    const conversationId = await ctx.db.insert("chatConversations", {
      guestEmail: args.guestEmail,
      guestName: args.guestName,
      status: "active",
      lastMessageAt: Date.now(),
    });

    return conversationId;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id("chatConversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("chatConversations"),
    message: v.string(),
    senderName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let senderId = undefined;

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
        .unique();

      if (user) {
        senderId = user._id;
      }
    }

    // Create message
    await ctx.db.insert("chatMessages", {
      conversationId: args.conversationId,
      senderId,
      senderName: args.senderName,
      message: args.message,
      isAdmin: false,
    });

    // Update conversation lastMessageAt
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });
  },
});

// Get current user's active conversation
export const getMyConversation = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("chatConversations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();
  },
});
