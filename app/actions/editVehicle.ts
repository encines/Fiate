"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { EditVehicleSchema } from "../../lib/validations";

export async function editVehicle(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    color: formData.get("color") || undefined,
  };

  const parsed = EditVehicleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, color } = parsed.data;

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    await prisma.userCar.update({
      where: { id: userCarId },
      data: {
        color: color || null,
      },
    });

    revalidatePath("/mycar");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el vehículo." };
  }
}
