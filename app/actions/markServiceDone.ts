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

    // Insert a ServiceHistory record so the UI can immediately detect the
    // completion for a given kilometraje (the frontend looks at history.kmAtService
    // and history.kmMilestone to decide if a task at a given km is done).
    const { error: insertError } = await supabase
      .from('ServiceHistory')
      .insert({
        userCarId,
        taskId,
        kmAtService: currentKm,
        cost: 0,
        date: new Date().toISOString(),
      });

    // Also update the UserCar currentKm if the checked km is greater.
    if (!insertError) {
      await supabase
        .from('UserCar')
        .update({ currentKm })
        .eq('id', userCarId);
    }

    if (insertError) throw insertError;

    revalidatePath("/plan");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al registrar el servicio" };
  }
}
