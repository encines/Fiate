"use server";

import { createClient } from "../../lib/supabase/server";

export async function sendPasswordResetEmail(email: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) return { error: error.message };

    return { success: true, message: "Si el correo existe, recibirás instrucciones." };
  } catch (error) {
    console.error("Error enviando email de recuperación:", error);
    return { error: "No se pudo enviar el correo de recuperación." };
  }
}
