"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteReminder(reminderId: string) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    const { data: reminder, error: fetchError } = await supabase
      .from('Reminder')
      .select('id, UserCar(userId)')
      .eq('id', reminderId)
      .single();

    if (fetchError || !reminder || (reminder.UserCar as any).userId !== sbUser.id) {
      return { error: "Recordatorio no encontrado o no autorizado" };
    }

    const { error: deleteError } = await supabase
      .from('Reminder')
      .delete()
      .eq('id', reminderId);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard");
    revalidatePath("/reminders");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el recordatorio" };
  }
}
