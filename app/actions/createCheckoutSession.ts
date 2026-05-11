"use server";

import { stripe } from "../../lib/stripe";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession() {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) {
    throw new Error("No autorizado");
  }

  // Consulta directa a Supabase en lugar de Prisma
  const { data: user, error: userError } = await supabase
    .from('User')
    .select('id, email, name, stripeCustomerId')
    .eq('id', sbUser.id)
    .single();

  if (userError || !user) throw new Error("Usuario no encontrado");

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
    });
    customerId = customer.id;
    
    // Actualizar en Supabase
    await supabase
      .from('User')
      .update({ stripeCustomerId: customerId })
      .eq('id', user.id);
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
  });

  if (stripeSession.url) {
    redirect(stripeSession.url);
  }
}
