"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";
import { EditVehicleSchema } from "../../lib/validations";

export async function editVehicle(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = {
    userCarId: formData.get("userCarId"),
    color: formData.get("color") || undefined,
    brand: formData.get("brand") || undefined,
    model: formData.get("model") || undefined,
    year: formData.get("year") || undefined,
    licensePlate: formData.get("licensePlate") || undefined,
  };

  const parsed = EditVehicleSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userCarId, color, brand, model, year, licensePlate } = parsed.data;

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { 
        user: true,
        catalogCar: {
          include: {
            model: { include: { brand: true } }
          }
        }
      }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado o no te pertenece." };
    }

    let finalCatalogCarId = userCar.catalogCarId;

    // Si cambió marca, modelo o año, necesitamos buscar/crear el CatalogCar
    if (brand || model || year) {
      const finalBrand = brand || userCar.catalogCar.model.brand.name;
      const finalModel = model || userCar.catalogCar.model.name;
      const finalYear = year || userCar.catalogCar.year;

      const brandEntity = await prisma.brand.upsert({
        where: { name: finalBrand },
        update: {},
        create: { name: finalBrand },
      });

      const modelEntity = await prisma.carModel.upsert({
        where: { name_brandId: { name: finalModel, brandId: brandEntity.id } },
        update: {},
        create: { name: finalModel, brandId: brandEntity.id },
      });

      const catalogCar = await prisma.catalogCar.upsert({
        where: { modelId_year: { modelId: modelEntity.id, year: finalYear } },
        update: {},
        create: { modelId: modelEntity.id, year: finalYear },
      });

      finalCatalogCarId = catalogCar.id;
    }

    // Lógica para imagen (Base64)
    const imageFile = formData.get("image") as File;
    let finalImageUrl = userCar.imageUrl;
    
    if (imageFile && imageFile.size > 0) {
      try {
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        finalImageUrl = `data:${imageFile.type};base64,${base64Image}`;
      } catch (e) {
        console.error("Error al procesar la imagen:", e);
      }
    }

    await prisma.userCar.update({
      where: { id: userCarId },
      data: {
        color: color ?? userCar.color,
        licensePlate: licensePlate ?? userCar.licensePlate,
        catalogCarId: finalCatalogCarId,
        imageUrl: finalImageUrl,
      },
    });

    revalidatePath("/mycar");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el vehículo." };
  }
}
