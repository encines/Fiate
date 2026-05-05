"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function addFuelLog(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const userCarId = formData.get("userCarId") as string;
  const km = parseInt(formData.get("km") as string);
  const liters = parseFloat(formData.get("liters") as string);
  const totalCost = parseFloat(formData.get("totalCost") as string);
  const date = formData.get("date") as string;

  if (!userCarId || isNaN(km) || isNaN(liters) || isNaN(totalCost)) {
    return { error: "Todos los campos numéricos son obligatorios." };
  }

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado." };
    }

    await prisma.fuelLog.create({
      data: {
        userCarId,
        km,
        liters,
        totalCost,
        date: date ? new Date(date) : new Date(),
      }
    });

    // Actualizar kilometraje actual del auto si el registro es mayor
    if (km > userCar.currentKm) {
      await prisma.userCar.update({
        where: { id: userCarId },
        data: { currentKm: km },
      });
    }

    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al registrar combustible." };
  }
}
