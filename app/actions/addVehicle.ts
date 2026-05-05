"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { AddVehicleSchema } from "../../lib/validations";
import { discoverMaintenancePlan } from "./discoverMaintenancePlan";

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
    return { error: parsed.error.issues[0].message };
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

    // 5. Autodiscover plan si existe en catálogo o IA
    try {
      await discoverMaintenancePlan(newCar.id);
    } catch (e) {
      console.warn("No se pudo autodiscurbir el plan al crear:", e);
    }

    revalidatePath("/dashboard");
    revalidatePath("/mycar");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al agregar el vehículo." };
  }
}
