"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UpdateMileageSchema } from "../../lib/validations";
import { verifyCarOwnership } from "../../lib/verify-ownership";

export async function updateMileage(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado." };

  const rawData = {
    userCarId: formData.get("userCarId"),
    newKm: formData.get("newKm"),
  };

  const parsed = UpdateMileageSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, newKm } = parsed.data;

  try {
    const ownership = await verifyCarOwnership(userCarId, sbUser.id);
    if (!ownership.valid) {
      return { error: ownership.error };
    }

    const { data: userCar, error: fetchError } = await supabase
      .from('UserCar')
      .select('id, currentKm')
      .eq('id', userCarId)
      .single();

    if (fetchError || !userCar) {
      return { error: "Vehículo no encontrado." };
    }

    const { error: updateError } = await supabase
      .from('UserCar')
      .update({ currentKm: newKm })
      .eq('id', userCarId);

    if (updateError) throw updateError;

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el kilometraje." };
  }
}
