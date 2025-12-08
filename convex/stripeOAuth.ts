"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const getAuthorizationUrl = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Giriş yapmalısınız");
    }

    // Get the Convex site URL for callback
    const callbackUrl = `${process.env.CONVEX_SITE_URL}/stripe/oauth/callback`;
    
    // Stripe OAuth URL
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.STRIPE_CONNECT_CLIENT_ID || "",
      scope: "read_write",
      redirect_uri: callbackUrl,
      state: identity.tokenIdentifier, // Use token as state for security
    });

    const authUrl = `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
    
    return { url: authUrl };
  },
});
