"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function deleteReminder(reminderId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  try {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: { userCar: { include: { user: true } } }
    });

    if (!reminder || reminder.userCar.user.email !== session.user.email) {
      return { error: "Recordatorio no encontrado o no te pertenece." };
    }

    await prisma.reminder.delete({
      where: { id: reminderId }
    });

    revalidatePath("/reminders");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el recordatorio." };
  }
}
