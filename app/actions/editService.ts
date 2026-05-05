"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { EditServiceSchema } from "../../lib/validations";

export async function editService(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    serviceId: formData.get("serviceId"),
    customName: formData.get("customName"),
    kmAtService: formData.get("kmAtService"),
    cost: formData.get("cost") || 0,
    date: formData.get("date") || undefined,
    notes: formData.get("notes") || "",
  };

  const parsed = EditServiceSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { serviceId, customName, kmAtService, cost, date, notes } = parsed.data;

  try {
    const service = await prisma.serviceHistory.findUnique({
      where: { id: serviceId },
      include: { userCar: { include: { user: true } } }
    });

    if (!service || service.userCar.user.email !== session.user.email) {
      return { error: "Servicio no encontrado o no te pertenece." };
    }

    const serviceDate = date ? new Date(date) : service.date;

    await prisma.serviceHistory.update({
      where: { id: serviceId },
      data: {
        customName,
        kmAtService,
        cost,
        date: serviceDate,
        notes,
      }
    });

    // Opcional: Actualizar el kilometraje actual si el servicio se reporta a un km mayor
    if (kmAtService > service.userCar.currentKm) {
      await prisma.userCar.update({
        where: { id: service.userCarId },
        data: { currentKm: kmAtService },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    revalidatePath("/plan");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al actualizar la reparación." };
  }
}
