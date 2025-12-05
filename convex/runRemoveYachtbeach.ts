import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const run = action({
  args: {},
  handler: async (ctx): Promise<{ updateCount: number; message: string }> => {
    return await ctx.runMutation(internal.removeYachtbeach.removeYachtbeachFromNames, {});
  },
});
