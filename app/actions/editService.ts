"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EditServiceSchema } from "../../lib/validations";

export async function editService(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    serviceId: formData.get("serviceId"),
    customName: formData.get("customName"),
    kmAtService: formData.get("kmAtService"),
    cost: formData.get("cost") || 0,
    date: formData.get("date") || undefined,
    notes: formData.get("notes") || "",
  };

  const parsed = EditServiceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { serviceId, customName, kmAtService, cost, date, notes } = parsed.data;

  try {
    const { data: service, error: fetchError } = await supabase
      .from('ServiceHistory')
      .select('id, userCarId, UserCar(userId, currentKm)')
      .eq('id', serviceId)
      .single();

    if (fetchError || !service || (service.UserCar as any).userId !== sbUser.id) {
      return { error: "Servicio no encontrado o no te pertenece." };
    }

    const serviceDate = date ? new Date(date).toISOString() : null;

    const { error: updateError } = await supabase
      .from('ServiceHistory')
      .update({
        customName,
        kmAtService,
        cost,
        date: serviceDate || undefined,
        notes,
      })
      .eq('id', serviceId);

    if (updateError) throw updateError;

    if (kmAtService > ((service.UserCar as any).currentKm || 0)) {
      await supabase
        .from('UserCar')
        .update({ currentKm: kmAtService })
        .eq('id', service.userCarId);
    }

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar la reparación." };
  }
}
