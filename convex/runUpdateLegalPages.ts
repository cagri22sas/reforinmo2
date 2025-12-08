"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const run = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; message: string; updatedCount: number }> => {
    return await ctx.runMutation(internal.updateLegalPages.updateAllLegalPages, {});
  },
});
