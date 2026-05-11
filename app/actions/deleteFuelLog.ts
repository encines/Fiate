"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteFuelLog(logId: string) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    // 1. Verificar propiedad usando Supabase join
    const { data: log, error: logError } = await supabase
      .from('FuelLog')
      .select('id, UserCar(userId)')
      .eq('id', logId)
      .single();

    if (logError || !log || (log.UserCar as any).userId !== sbUser.id) {
      return { error: "Registro no encontrado o no autorizado" };
    }

    // 2. Eliminar en Supabase
    const { error: deleteError } = await supabase
      .from('FuelLog')
      .delete()
      .eq('id', logId);

    if (deleteError) throw deleteError;

    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el registro" };
  }
}
