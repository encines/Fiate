"use server";

import { createClient } from "../../lib/supabase/server";
import { LoginSchema } from "../../lib/validations";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const supabase = await createClient();
  
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return "Credenciales incorrectas o cuenta no verificada.";
  }

  redirect("/dashboard");
}
