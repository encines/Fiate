"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

import { FuelLogSchema } from "../../lib/validations";

export async function addFuelLog(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    km: formData.get("km"),
    liters: formData.get("liters"),
    cost: formData.get("totalCost"),
    date: formData.get("date") || undefined,
  };

  const parsed = FuelLogSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, km, liters, cost, date } = parsed.data;

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
        totalCost: cost,
        date: date,
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
