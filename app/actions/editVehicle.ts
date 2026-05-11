"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { EditVehicleSchema } from "../../lib/validations";
import { verifyCarOwnership } from "../../lib/verify-ownership";

export async function editVehicle(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) return { error: "No autorizado." };

  const rawData = {
    userCarId: formData.get("userCarId"),
    color: formData.get("color") || undefined,
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    year: formData.get("year") || undefined,
    licensePlate: formData.get("licensePlate") || undefined,
  };

  const parsed = EditVehicleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, ...data } = parsed.data;

  try {
    const ownership = await verifyCarOwnership(userCarId, sbUser.id);
    if (!ownership.valid) {
      return { error: ownership.error };
    }

    const imageFile = formData.get("image") as File;
    console.log("[editVehicle] image field:", imageFile?.name, imageFile?.size, imageFile?.constructor?.name);
    let newImageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return { error: "El archivo debe ser una imagen válida." };
      }
      if (imageFile.size > 10 * 1024 * 1024) {
        return { error: "La imagen no debe superar los 10 MB." };
      }
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `car_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user_${sbUser.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error(uploadError);
        return { error: "Error al subir la imagen." };
      }

      newImageUrl = uploadData.path;
    }

    const updateFields: Record<string, any> = {}
    if (data.color !== undefined) updateFields.color = data.color
    if (data.licensePlate !== undefined) updateFields.licensePlate = data.licensePlate
    if (data.brand !== undefined) updateFields.brand = data.brand
    if (data.model !== undefined) updateFields.model = data.model
    if (data.year !== undefined) updateFields.year = data.year
    if (newImageUrl !== null) updateFields.imageUrl = newImageUrl

    const { error: updateError } = await supabase
      .from('UserCar')
      .update(updateFields)
      .eq('id', userCarId);

    if (updateError) throw updateError;

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el vehículo" };
  }
}
