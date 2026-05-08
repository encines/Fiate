"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabase";
import { DocumentSchema } from "../../lib/validations";

export async function addDocument(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
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
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });
 
    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado." };
    }
 
    const isPro = userCar.user.plan === "PRO";
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
        const buffer = await item.arrayBuffer();
        fileBuffer = Buffer.from(buffer);
        contentType = item.type;
        fileExt = item.name.split('.').pop() || 'jpg';
      } else if (typeof item === "string" && item.startsWith("data:image")) {
        // Manejar Base64 (de la compresión en cliente)
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
 
    await prisma.carDocument.create({
      data: {
        userCarId,
        type,
        name,
        // Guardamos los paths en lugar de Base64
        imageUrl: JSON.stringify(uploadedPaths),
        expiryDate: expiryDate || null,
      }
    });
 
    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar el documento." };
  }
}
