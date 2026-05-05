"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  try {
    const service = await prisma.serviceHistory.findUnique({
      where: { id: serviceId },
      include: { userCar: { include: { user: true } } }
    });

    if (!service || service.userCar.user.email !== session.user.email) {
      return { error: "Servicio no encontrado o no autorizado." };
    }

    await prisma.serviceHistory.delete({
      where: { id: serviceId }
    });

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al eliminar el servicio." };
  }
}
