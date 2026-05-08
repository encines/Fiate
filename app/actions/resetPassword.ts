"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "../../lib/validations";

export async function resetPasswordAction(email: string, newPassword: string) {
  try {
    // Validar contraseña (usamos la misma lógica que el registro)
    if (newPassword.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres." };
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar en Prisma (Nuestra fuente de verdad para el login)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Error reseteando contraseña en Prisma:", error);
    return { error: "No se pudo actualizar la contraseña en la base de datos principal." };
  }
}
