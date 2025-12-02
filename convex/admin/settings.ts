import { ConvexError } from "convex/values";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getCurrentUser } from "../helpers";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    return setting?.value;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const settings = await ctx.db.query("settings").collect();
    
    // Convert to object format
    const settingsObject: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = setting.value;
    });

    return settingsObject;
  },
});

export const update = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
      });
    }
  },
});

export const updateMultiple = mutation({
  args: {
    settings: v.array(
      v.object({
        key: v.string(),
        value: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (user.role !== "admin") {
      throw new ConvexError({
        message: "Unauthorized",
        code: "FORBIDDEN",
      });
    }

    for (const setting of args.settings) {
      const existing = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", setting.key))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { value: setting.value });
      } else {
        await ctx.db.insert("settings", {
          key: setting.key,
          value: setting.value,
        });
      }
    }
  },
});
