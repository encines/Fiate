"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabase";
import { DocumentSchema } from "../../lib/validations";

export async function addDocument(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user: sbUser } } = await supabase.auth.getUser();

  if (!sbUser?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    type: formData.get("type"),
    name: formData.get("name"),
    expiryDate: formData.get("expiryDate") || undefined,
  };

  const parsed = DocumentSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, type, name, expiryDate } = parsed.data;
 
  try {
    // 1. Verificar propiedad del coche usando Supabase
    const { data: userCar, error: carError } = await supabase
      .from('UserCar')
      .select('id, userId, User(plan, email)')
      .eq('id', userCarId)
      .single();
 
    if (carError || !userCar || (userCar.User as any).email !== sbUser.email) {
      return { error: "Vehículo no encontrado o no autorizado." };
    }
 
    const isPro = (userCar.User as any).plan === "PRO";
    const allImages = formData.getAll("image").filter(item => 
      item instanceof File && item.size > 0
    ) as File[];

    if (!isPro && allImages.length > 1) {
      return { error: "El plan Estándar solo permite 1 foto por documento. Actualiza a PRO para subir múltiples fotos." };
    }
    
    const uploadedPaths: string[] = [];
    const allItems = formData.getAll("image");

    for (const item of allItems) {
      let fileBuffer: Buffer;
      let contentType: string;
      let fileExt: string;

      if (item instanceof File && item.size > 0) {
        if (!item.type.startsWith('image/')) {
          return { error: `El archivo ${item.name} debe ser una imagen válida.` };
        }
        if (item.size > 10 * 1024 * 1024) {
          return { error: `El archivo ${item.name} no debe superar los 10 MB.` };
        }
        const buffer = await item.arrayBuffer();
        fileBuffer = Buffer.from(buffer);
        contentType = item.type;
        fileExt = item.name.split('.').pop() || 'jpg';
      } else if (typeof item === "string" && item.startsWith("data:image")) {
        const [meta, data] = item.split(",");
        contentType = meta.split(":")[1].split(";")[0];
        fileBuffer = Buffer.from(data, "base64");
        fileExt = contentType.split("/")[1] || 'jpg';
      } else {
        continue;
      }

      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `user_${userCar.userId}/car_${userCarId}/${fileName}`;

      const { data, error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(filePath, fileBuffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) {
        console.error("Error al subir a Supabase:", uploadError);
        continue;
      }

      uploadedPaths.push(data.path);
    }
 
    // 2. Crear documento en Supabase
    const { error: insertError } = await supabase
      .from('CarDocument')
      .insert({
        userCarId,
        type,
        name,
        imageUrl: JSON.stringify(uploadedPaths),
        expiryDate: expiryDate || null,
      });

    if (insertError) throw insertError;
 
    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar el documento." };
  }
}
