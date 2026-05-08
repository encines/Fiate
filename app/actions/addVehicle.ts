"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabase";
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
      include: {
        _count: {
          select: { cars: true }
        }
      }
    });

    if (!user) return { error: "Usuario no encontrado." };

    // Verificación de Plan
    if (user.plan === "STANDARD" && user._count.cars >= 1) {
      return { 
        error: "Has alcanzado el límite de 1 vehículo para el plan Estándar. ¡Pásate a PRO para agregar vehículos ilimitados!" 
      };
    }

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

    // Lógica para imagen (Supabase Storage)
    const imageFile = formData.get("image") as File;
    let imageUrl = null;
    
    if (imageFile && imageFile.size > 0) {
      try {
        const fileExt = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `car_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `user_${user.id}/${fileName}`;

        const { data, error: uploadError } = await supabaseAdmin.storage
          .from('vehicles')
          .upload(filePath, imageFile, {
            contentType: imageFile.type,
            upsert: true
          });

        if (uploadError) {
          console.error("Error al subir imagen de vehículo:", uploadError);
        } else {
          imageUrl = data.path;
        }
      } catch (e) {
        console.error("Error al procesar la imagen:", e);
      }
    }

    // 4. Crear el Auto del Usuario
    const newCar = await prisma.userCar.create({
      data: {
        userId: user.id,
        catalogCarId: catalogCar.id,
        currentKm,
        imageUrl, // Ahora guarda el path de Supabase
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
