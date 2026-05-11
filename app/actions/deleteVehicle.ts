"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyCarOwnership } from "../../lib/verify-ownership";

export async function deleteVehicle(userCarId: string) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    const ownership = await verifyCarOwnership(userCarId, sbUser.id);
    if (!ownership.valid) {
      return { error: ownership.error };
    }

    const { error: deleteError } = await supabase
      .from('UserCar')
      .delete()
      .eq('id', userCarId);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el vehículo" };
  }
}
