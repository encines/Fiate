"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import bcrypt from "bcryptjs";
import { ChangePasswordSchema } from "../../lib/validations";

export async function changePassword(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "No autorizado." };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = ChangePasswordSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return { error: "Usuario no encontrado o no tiene contraseña definida." };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { error: "La contraseña actual es incorrecta." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return { error: "Ocurrió un error al cambiar la contraseña." };
  }
}
