"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AddMaintenanceTaskSchema } from "../../lib/validations";

export async function addTask(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    name: formData.get("name"),
    frequencyKm: formData.get("frequencyKm"),
  };

  const parsed = AddMaintenanceTaskSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, name, frequencyKm } = parsed.data;

  try {
    // 1. Obtener coche y datos del usuario (plan)
    const { data: userCar, error: carError } = await supabase
      .from('UserCar')
      .select('id, userId, user:User(plan)')
      .eq('id', userCarId)
      .eq('userId', authUser.id)
      .single();

    if (carError || !userCar) {
      return { error: "Vehículo no encontrado o no autorizado." };
    }

    // 2. Contar tareas actuales para validar límites de plan
    const { count, error: countError } = await supabase
      .from('MaintenanceTask')
      .select('*', { count: 'exact', head: true })
      .eq('userCarId', userCarId);

    const userPlan = (userCar.user as any)?.plan || 'STANDARD';

    if (userPlan === "STANDARD" && (count || 0) >= 6) {
      return { 
        error: "Has alcanzado el límite de 6 tareas para el plan STANDARD. ¡Mejora a PRO para agregar tareas ilimitadas!" 
      };
    }

    // 3. Crear la tarea
    const { error: insertError } = await supabase
      .from('MaintenanceTask')
      .insert({
        name,
        frequencyKm,
        userCarId,
      });

    if (insertError) throw insertError;

    revalidatePath("/plan");
    
    return { success: true, message: "Tarea agregada correctamente." };
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    return { error: "Error al agregar la tarea de mantenimiento." };
  }
}
