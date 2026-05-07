"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { AddMaintenanceTaskSchema } from "../../lib/validations";

export async function addTask(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    name: formData.get("name"),
    frequencyKm: formData.get("frequencyKm"),
  };

  const parsed = AddMaintenanceTaskSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, name, frequencyKm } = parsed.data;

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado o no autorizado." };
    }

    const tasksCount = await prisma.maintenanceTask.count({
      where: { userCarId }
    });

    if (userCar.user.plan === "STANDARD" && tasksCount >= 6) {
      return { 
        error: "Has alcanzado el límite de 6 tareas para el plan STANDARD. ¡Mejora a PRO para agregar tareas ilimitadas!" 
      };
    }

    await prisma.maintenanceTask.create({
      data: {
        name,
        frequencyKm,
        userCarId,
      }
    });

    revalidatePath("/plan");
    
    return { success: true, message: "Tarea agregada correctamente." };
  } catch (error) {
    console.error(error);
    return { error: "Error al agregar la tarea de mantenimiento." };
  }
}
