"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  try {
    const task = await prisma.maintenanceTask.findUnique({
      where: { id: taskId },
      include: { userCar: { include: { user: true } } }
    });

    if (!task || task.userCar.user.email !== session.user.email) {
      return { error: "Tarea no encontrada o no autorizada." };
    }

    await prisma.maintenanceTask.delete({
      where: { id: taskId }
    });

    revalidatePath("/plan");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar la tarea." };
  }
}
