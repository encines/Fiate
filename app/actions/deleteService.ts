"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteService(serviceId: string) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado" };

  try {
    const { data: service, error: fetchError } = await supabase
      .from('ServiceHistory')
      .select('id, UserCar(userId)')
      .eq('id', serviceId)
      .single();

    if (fetchError || !service || (service.UserCar as any).userId !== sbUser.id) {
      return { error: "Registro no encontrado o no autorizado" };
    }

    const { error: deleteError } = await supabase
      .from('ServiceHistory')
      .delete()
      .eq('id', serviceId);

    if (deleteError) throw deleteError;

    revalidatePath("/services");
    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el registro" };
  }
}
