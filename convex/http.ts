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
      return new Response("No signature", { status: 400 });
    }

    // In production, you should verify the webhook signature
    // For now, we'll just parse the event
    let event;
    try {
      event = JSON.parse(body);
    } catch (err) {
      return new Response(`Webhook Error: ${err}`, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await ctx.runMutation(internal.orders.handleSuccessfulPayment, {
          orderId: session.metadata.orderId,
          paymentIntentId: session.payment_intent,
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await ctx.runMutation(internal.orders.handleFailedPayment, {
          paymentIntentId: paymentIntent.id,
        });
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  }),
});

export default http;
