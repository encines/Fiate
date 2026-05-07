"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { AddCustomServiceSchema } from "../../lib/validations";

export async function addCustomService(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
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
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    const serviceDate = date || new Date();

    // Lógica para imagen (Base64 para demostración local)
    const imageFile = formData.get("image") as File;
    let imageUrl = null;
    
    if (imageFile && imageFile.size > 0) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        imageUrl = `data:${imageFile.type};base64,${base64Image}`;
      } catch (e) {
        console.error("Error al procesar la imagen:", e);
      }
    }

    await prisma.serviceHistory.create({
      data: {
        userCarId,
        customName,
        kmAtService,
        cost,
        date: serviceDate,
        notes,
        imageUrl,
      }
    });

    // Opcional: Actualizar el kilometraje actual si el servicio se reporta a un km mayor
    if (kmAtService > userCar.currentKm) {
      await prisma.userCar.update({
        where: { id: userCarId },
        data: { currentKm: kmAtService },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al registrar la reparación." };
  }
}
