"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    const { data: task, error: fetchError } = await supabase
      .from('MaintenanceTask')
      .select('id, UserCar(userId)')
      .eq('id', taskId)
      .single();

    if (fetchError || !task || (task.UserCar as any).userId !== sbUser.id) {
      return { error: "Tarea no encontrada o no autorizada" };
    }

    const { error: deleteError } = await supabase
      .from('MaintenanceTask')
      .delete()
      .eq('id', taskId);

    if (deleteError) throw deleteError;

    revalidatePath("/plan");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar la tarea" };
  }
}
