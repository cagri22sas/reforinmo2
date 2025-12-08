import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      console.error("Stripe webhook: No signature header");
      return new Response("No signature", { status: 400 });
    }

    try {
      await ctx.runAction(internal.stripeWebhook.handleWebhook, {
        body,
        signature: sig,
      });

      return new Response(JSON.stringify({ received: true }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Stripe webhook error:", err);
      return new Response(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        { status: 400 }
      );
    }
  }),
});

http.route({
  path: "/stripe/oauth/callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Handle OAuth error
    if (error) {
      const errorDescription = url.searchParams.get("error_description");
      console.error("Stripe OAuth error:", error, errorDescription);
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/admin/stripe-config?error=${encodeURIComponent(errorDescription || error)}`,
        },
      });
    }

    // Validate parameters
    if (!code || !state) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/stripe-config?error=invalid_request",
        },
      });
    }

    try {
      // Exchange code for access token
      const response = await fetch("https://connect.stripe.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_secret: process.env.STRIPE_SECRET_KEY || "",
        }).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Stripe OAuth error:", errorText);
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/admin/stripe-config?error=oauth_exchange_failed",
          },
        });
      }

      const data = await response.json() as {
        access_token: string;
        refresh_token: string;
        token_type: string;
        stripe_publishable_key: string;
        stripe_user_id: string;
        scope: string;
      };

      // Save to database
      await ctx.runMutation(internal.admin.stripeConfig.saveOAuthCredentials, {
        tokenIdentifier: state,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        publishableKey: data.stripe_publishable_key,
        stripeUserId: data.stripe_user_id,
      });

      // Redirect to success page
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/admin/stripe-config?success=true",
        },
      });
    } catch (err) {
      console.error("OAuth callback processing error:", err);
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/admin/stripe-config?error=${encodeURIComponent(err instanceof Error ? err.message : "unknown_error")}`,
        },
      });
    }
  }),
});

export default http;
