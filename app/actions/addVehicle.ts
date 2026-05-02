"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { AddVehicleSchema } from "../../lib/validations";

export async function addVehicle(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    currentKm: formData.get("currentKm"),
    lastServiceKm: formData.get("lastServiceKm"),
  };

  const parsed = AddVehicleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { brand: brandName, model: modelName, year, currentKm, lastServiceKm } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return { error: "Usuario no encontrado." };

    // 1. Encontrar o crear la Marca
    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    // 2. Encontrar o crear el Modelo
    const carModel = await prisma.carModel.upsert({
      where: { 
        name_brandId: {
          name: modelName,
          brandId: brand.id
        }
      },
      update: {},
      create: { 
        name: modelName,
        brandId: brand.id
      },
    });

    // 3. Encontrar o crear el CatalogCar
    const catalogCar = await prisma.catalogCar.upsert({
      where: {
        modelId_year: {
          modelId: carModel.id,
          year: year
        }
      },
      update: {},
      create: {
        modelId: carModel.id,
        year: year
      },
    });

    // 4. Crear el Auto del Usuario
    const newCar = await prisma.userCar.create({
      data: {
        userId: user.id,
        catalogCarId: catalogCar.id,
        currentKm,
      },
    });

    // 5. Autocompletar historial si hay tareas en el catálogo
    const tasks = await prisma.maintenanceTask.findMany({
      where: { catalogCarId: catalogCar.id },
    });

    if (tasks.length > 0) {
      const historyData = [];
      const baseDate = new Date();
      const targetKm = lastServiceKm || currentKm;

      for (const task of tasks) {
        if (!task.frequencyKm) continue;

        let currentMilestone = task.frequencyKm;
        while (currentMilestone <= targetKm) {
          historyData.push({
            userCarId: newCar.id,
            taskId: task.id,
            date: baseDate,
            kmAtService: currentMilestone,
            cost: 0,
          });
          currentMilestone += task.frequencyKm;
        }
      }

      if (historyData.length > 0) {
        await prisma.serviceHistory.createMany({
          data: historyData,
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al agregar el vehículo." };
  }
}
