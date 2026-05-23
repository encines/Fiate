"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "No autorizado." };

  if (!name || !name.trim()) return { error: "El nombre es requerido." };

  const { error } = await supabase
    .from("User")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    return { error: "Error al actualizar el perfil." };
  }

  // También actualizar en Auth metadata por si acaso
  await supabase.auth.updateUser({
    data: { full_name: name },
  });

  revalidatePath("/settings");
  return { success: true };
}
