"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AddVehicleSchema } from "../../lib/validations";

export async function addVehicle(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // Obtener usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "No autorizado." };
  }

  const rawData = {
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    currentKm: formData.get("currentKm"),
    lastServiceKm: formData.get("lastServiceKm"),
  };

  const parsed = AddVehicleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { brand, model, year, currentKm } = parsed.data;

  try {
    // 1. Verificación de Plan (Opcional, se puede manejar con RLS en Supabase)
    const { data: userData } = await supabase
      .from('User')
      .select('plan, cars:UserCar(count)')
      .eq('id', user.id)
      .single();

    if (userData && userData.plan === "STANDARD" && (userData.cars as any)[0].count >= 1) {
      return { 
        error: "Has alcanzado el límite de 1 vehículo para el plan Estándar. ¡Pásate a PRO para agregar vehículos ilimitados!" 
      };
    }

    // 2. Manejo de Imagen
    const imageFile = formData.get("image") as File;
    let imageUrl = null;
    
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return { error: "El archivo debe ser una imagen válida." };
      }
      if (imageFile.size > 10 * 1024 * 1024) {
        return { error: "La imagen no debe superar los 10 MB." };
      }
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `car_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user_${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(filePath, imageFile);

      if (!uploadError) {
        imageUrl = uploadData.path;
      }
    }

    // 3. Crear el Vehículo en Supabase
    const { data: newCar, error: insertError } = await supabase
      .from('UserCar')
      .insert({
        userId: user.id,
        brand,
        model,
        year,
        currentKm,
        imageUrl,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al agregar el vehículo." };
  }
}
