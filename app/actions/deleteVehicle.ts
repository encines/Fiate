"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteVehicle(carId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cars: true }
    });

    if (!user) return { error: "Usuario no encontrado." };

    // Verificar que el auto pertenezca al usuario
    const car = user.cars.find(c => c.id === carId);
    if (!car) return { error: "Vehículo no encontrado o no pertenece a tu cuenta." };

    // Eliminar el vehículo (esto eliminará el historial por Cascade en el schema)
    await prisma.userCar.delete({
      where: { id: carId }
    });

    // Si el auto eliminado era el activo, limpiar la cookie
    const cookieStore = await cookies();
    const activeCarId = cookieStore.get("fiate_active_car")?.value;
    
    if (activeCarId === carId) {
      cookieStore.delete("fiate_active_car");
    }

    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/services");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al eliminar el vehículo." };
  }
}
