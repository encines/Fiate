"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { ReminderSchema } from "../../lib/validations";

export async function addReminder(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    title: formData.get("title"),
    date: formData.get("date"),
    detail: formData.get("detail"),
  };

  const parsed = ReminderSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Datos del recordatorio inválidos.";
    return { error: errorMessage };
  }

  const { userCarId, title, date, detail } = parsed.data;

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    await prisma.reminder.create({
      data: {
        userCarId,
        title,
        date: date,
        detail,
      }
    });

    revalidatePath("/reminders");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear el recordatorio." };
  }
}
