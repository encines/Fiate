"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markServiceDone(userCarId: string, taskId: string, currentKm: number) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    const { data: userCar, error: fetchError } = await supabase
      .from('UserCar')
      .select('id, userId')
      .eq('id', userCarId)
      .single();

    if (fetchError || !userCar || userCar.userId !== sbUser.id) {
      return { error: "No tienes permiso para modificar este vehículo" };
    }

    // Insert a ServiceHistory record so the UI detects the completion.
    const { error: insertError } = await supabase
      .from('ServiceHistory')
      .insert({
        userCarId,
        taskId,
        kmAtService: currentKm,
        cost: 0,
        date: new Date().toISOString(),
      });

    if (insertError) throw insertError;

    revalidatePath("/plan");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al registrar el servicio" };
  }
}
