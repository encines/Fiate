"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ReminderSchema } from "../../lib/validations";

export async function addReminder(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    title: formData.get("title"),
    date: formData.get("date"),
    detail: formData.get("detail"),
  };

  const parsed = ReminderSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Datos del recordatorio inválidos.";
    return { error: errorMessage };
  }

  const { userCarId, title, date, detail } = parsed.data;

  try {
    const { data: userCar, error: carError } = await supabase
      .from('UserCar')
      .select('id, userId')
      .eq('id', userCarId)
      .eq('userId', authUser.id)
      .single();

    if (carError || !userCar) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    const { error: insertError } = await supabase
      .from('Reminder')
      .insert({
        userCarId,
        title,
        date: date,
        detail,
      });

    if (insertError) throw insertError;

    revalidatePath("/reminders");
    
    return { success: true };
  } catch (error) {
    console.error("Error al crear recordatorio:", error);
    return { error: "Error al crear el recordatorio." };
  }
}
