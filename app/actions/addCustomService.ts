"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AddCustomServiceSchema } from "../../lib/validations";
import { supabaseAdmin } from "../../lib/supabase";

export async function addCustomService(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    customName: formData.get("customName"),
    kmAtService: formData.get("kmAtService"),
    cost: formData.get("cost") || 0,
    date: formData.get("date") || undefined,
    notes: formData.get("notes"),
  };

  const parsed = AddCustomServiceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, customName, kmAtService, cost, date, notes } = parsed.data;

  try {
    // 1. Verificar propiedad del coche
    const { data: userCar, error: carError } = await supabase
      .from("UserCar")
      .select("id, currentKm, userId, User(plan)")
      .eq("id", userCarId)
      .eq("userId", authUser.id)
      .single();

    if (carError || !userCar) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    const isPro =
      (userCar as { User?: { plan?: string } }).User?.plan === "PRO";

    const serviceDate = date || new Date().toISOString();

    // 2. Subir imagen a Supabase Storage si existe
    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      if (!isPro) {
        return { error: "La subida de archivos es exclusiva de Fiate PRO." };
      }
      if (!imageFile.type.startsWith("image/")) {
        return { error: "El archivo debe ser una imagen válida." };
      }
      if (imageFile.size > 10 * 1024 * 1024) {
        return { error: "La imagen no debe superar los 10 MB." };
      }
      const fileExt = imageFile.name.split(".").pop() || "jpg";
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user_${authUser.id}/car_${userCarId}/${fileName}`;

      const buffer = await imageFile.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from("documents")
          .upload(filePath, fileBuffer, {
            contentType: imageFile.type,
            upsert: true,
          });

      if (!uploadError && uploadData) {
        imageUrl = JSON.stringify([uploadData.path]);
      } else {
        console.error("Admin upload error:", uploadError);
      }
    }

    // 3. Crear registro en ServiceHistory
    const { error: insertError } = await supabase
      .from("ServiceHistory")
      .insert({
        userCarId,
        customName,
        kmAtService,
        cost,
        date: serviceDate,
        notes,
        imageUrl,
      });

    if (insertError) throw insertError;

    // 4. Actualizar el kilometraje del coche si es mayor
    if (kmAtService > (userCar.currentKm || 0)) {
      await supabase
        .from("UserCar")
        .update({ currentKm: kmAtService })
        .eq("id", userCarId);
    }

    revalidatePath("/dashboard");
    revalidatePath("/services");

    return { success: true };
  } catch (error) {
    console.error("Error al registrar servicio:", error);
    return { error: "Error al registrar la reparación." };
  }
}
