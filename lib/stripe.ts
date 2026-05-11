import Stripe from "stripe";

function createStripeInstance() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY no configurada.");
  }
  return new Stripe(key, {
    apiVersion: Stripe.API_VERSION as any,
  });
}

export const stripe = createStripeInstance();
