"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function deleteFuelLog(logId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  try {
    const log = await prisma.fuelLog.findUnique({
      where: { id: logId },
      include: { 
        userCar: {
          include: { user: true }
        }
      }
    });

    if (!log || log.userCar.user.email !== session.user.email) {
      return { error: "Registro no encontrado." };
    }

    await prisma.fuelLog.delete({
      where: { id: logId }
    });

    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el registro." };
  }
}
