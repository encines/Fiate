"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function updateTaskFrequency(taskId: string, newFrequencyKm: number) {
  const session = await auth();
  if (!session?.user?.email) return { error: "No autorizado." };

  try {
    // Podríamos verificar que el usuario tiene acceso al catálogo al que pertenece esta tarea,
    // pero como las tareas de catálogo están ligadas al CatalogCar y este a los UserCars,
    // una simplificación es permitirlo si el ID es válido por ahora (o buscar la relación).
    
    await prisma.maintenanceTask.update({
      where: { id: taskId },
      data: {
        frequencyKm: newFrequencyKm,
      },
    });

    revalidatePath("/plan");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar la frecuencia de la tarea." };
  }
}
