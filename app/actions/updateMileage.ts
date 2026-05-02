"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";
import { UpdateMileageSchema } from "../../lib/validations";

export async function updateMileage(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "No autorizado." };

  const rawData = {
    userCarId: formData.get("userCarId"),
    newKm: formData.get("newKm"),
  };

  const parsed = UpdateMileageSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { userCarId, newKm } = parsed.data;

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true },
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no pertenece al usuario." };
    }

    if (newKm < userCar.currentKm) {
      return { error: "El nuevo kilometraje no puede ser menor al actual." };
    }

    await prisma.userCar.update({
      where: { id: userCarId },
      data: { currentKm: newKm },
    });

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el kilometraje." };
  }
}
