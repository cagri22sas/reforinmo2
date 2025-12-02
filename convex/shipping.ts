import { query } from "./_generated/server";

export const listActiveMethods = query({
  args: {},
  handler: async (ctx) => {
    const methods = await ctx.db.query("shippingMethods").collect();
    return methods
      .filter((m) => m.active)
      .sort((a, b) => a.order - b.order);
  },
});
