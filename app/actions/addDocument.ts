"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

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
    let imagesData: string[] = [];
    const allImages = formData.getAll("image").filter(item => 
      (item instanceof File && item.size > 0) || (typeof item === "string" && item.startsWith("data:image"))
    );

    if (!isPro && allImages.length > 1) {
      return { error: "El plan Estándar solo permite 1 foto por documento. Actualiza a PRO para subir múltiples fotos." };
    }
    
    for (const item of allImages) {
      if (typeof item === "string") {
        imagesData.push(item);
      } else if (item instanceof File) {
        const buffer = await item.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        imagesData.push(`data:${item.type};base64,${base64Image}`);
      }
    }
 
    await prisma.carDocument.create({
      data: {
        userCarId,
        type,
        name,
        imageUrl: JSON.stringify(imagesData),
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
