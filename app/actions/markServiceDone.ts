"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function markServiceDone(userCarId: string, taskId: string, kmMilestone: number) {
  const session = await auth();
  if (!session?.user?.email) return { error: "No autorizado." };

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true },
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no pertenece al usuario." };
    }

    // Verificar si ya existe este hito exacto en la tabla de marcas del manual
    const existing = await prisma.maintenanceCheck.findFirst({
      where: {
        userCarId,
        taskId,
        kmMilestone,
      },
    });

    if (existing) {
      // Si ya existía, lo borramos (Toggle)
      await prisma.maintenanceCheck.delete({
        where: { id: existing.id },
      });
    } else {
      // Crear nueva marca en el manual (SIN afectar al historial de servicios)
      await prisma.maintenanceCheck.create({
        data: {
          userCarId,
          taskId,
          kmMilestone,
        },
      });
    }

    revalidatePath("/mycar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar el servicio." };
  }
}
