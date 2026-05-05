"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import { revalidatePath } from "next/cache";

export async function addDocument(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const userCarId = formData.get("userCarId") as string;
  const type = formData.get("type") as string;
  const name = formData.get("name") as string;
  const expiryDate = formData.get("expiryDate") as string;
  const imageFile = formData.get("image") as File;

  if (!userCarId || !type || !name) {
    return { error: "Faltan campos obligatorios." };
  }

  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { user: true }
    });

    if (!userCar || userCar.user.email !== session.user.email) {
      return { error: "Vehículo no encontrado." };
    }

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString('base64');
      imageUrl = `data:${imageFile.type};base64,${base64Image}`;
    }

    await prisma.carDocument.create({
      data: {
        userCarId,
        type,
        name,
        imageUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      }
    });

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error al guardar el documento." };
  }
}
