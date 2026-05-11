"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FuelLogSchema } from "../../lib/validations";

export async function addFuelLog(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    km: formData.get("km"),
    liters: formData.get("liters"),
    cost: formData.get("totalCost"),
    date: formData.get("date") || undefined,
  };

  const parsed = FuelLogSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, km, liters, cost, date } = parsed.data;

  try {
    const { data: userCar, error: carError } = await supabase
      .from('UserCar')
      .select('id, currentKm')
      .eq('id', userCarId)
      .eq('userId', authUser.id)
      .single();

    if (carError || !userCar) {
      return { error: "Vehículo no encontrado." };
    }

    const { error: insertError } = await supabase
      .from('FuelLog')
      .insert({
        userCarId,
        km,
        liters,
        totalCost: cost,
        date: date || new Date().toISOString(),
      });

    if (insertError) throw insertError;

    if (km > (userCar.currentKm || 0)) {
      await supabase
        .from('UserCar')
        .update({ currentKm: km })
        .eq('id', userCarId);
    }

    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error al registrar combustible:", error);
    return { error: "Error al registrar combustible." };
  }
}
