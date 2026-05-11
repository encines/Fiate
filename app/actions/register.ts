"use server";

import { createClient } from "../../lib/supabase/server";
import { RegisterSchema } from "../../lib/validations";
import { redirect } from "next/navigation";

export async function registerUser(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = RegisterSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  // Registrar en Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirigir al login o al dashboard dependiendo de si quieres confirmar email
  redirect("/login?message=Verifica tu correo para continuar");
}
