"use server";

import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { LoginSchema } from "../../lib/validations";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(rawData);
  if (!parsed.success) {
    return parsed.error.errors[0].message;
  }

  try {
    await signIn("credentials", parsed.data);
  } catch (error) {
    if (isRedirectError(error)) {
        throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales incorrectas.";
        default:
          return "Algo salió mal.";
      }
    }
    throw error;
  }
}
