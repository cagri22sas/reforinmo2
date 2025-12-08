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

export default http;
