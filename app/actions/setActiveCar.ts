"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setActiveCar(carId: string) {
  const cookieStore = await cookies();
  cookieStore.set("fiate_active_car", carId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
