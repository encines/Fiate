import Stripe from "stripe";

let instance: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!instance) {
      const key = process.env.STRIPE_SECRET_KEY || "";
      instance = new Stripe(key, {
        apiVersion: "2026-04-22.dahlia" as any,
      });
    }
    return (instance as any)[prop];
  }
});
