import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { cache } from "react";

export interface UserCarSummary {
  id: string;
  imageUrl: string | null;
  licensePlate: string | null;
  currentKm: number;
  brand: string | null;
  model: string | null;
  year: number | null;
  catalogCar?: {
    year: number;
    model: {
      name: string;
      brand: { name: string };
    };
  } | null;
}

interface UserWithCars {
  id: string;
  email: string;
  plan: string;
  cars: UserCarSummary[];
}

export const getActiveCarData = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !authUser) return null;

  // 1. Intentar obtener el usuario
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select(
      `
      id, email, name, plan,
      cars:UserCar (
        id, imageUrl, licensePlate, currentKm, brand, model, year,
        catalogCar:CatalogCar (
          year,
          model:CarModel (
            name,
            brand:Brand ( name )
          )
        )
      )
    `,
    )
    .eq("id", authUser.id)
    .single();

  let user = userData;

  // 2. SI NO EXISTE EN LA TABLA "User", LO CREAMOS AL VUELO
  if (userError || !user) {
    const { data: newUser, error: createError } = await supabase
      .from("User")
      .insert({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || "Usuario",
        plan: "STANDARD",
      })
      .select()
      .single();

    if (createError || !newUser) {
      console.error("Error auto-creando perfil:", createError);
      return null;
    }
    user = { ...newUser, cars: [] } as typeof userData;
  }

  if (!user) return null;

  const cookieStore = await cookies();
  const activeCarIdFromCookie = cookieStore.get("fiate_active_car")?.value;

  const userWithCars = user as unknown as UserWithCars;
  const cars = userWithCars.cars || [];
  const cookieCarExists = cars.some((c) => c.id === activeCarIdFromCookie);
  const targetCarId = cookieCarExists ? activeCarIdFromCookie : cars[0]?.id;

  // 3. Fetch profundo del vehículo activo
  let activeCar = null;
  if (targetCarId) {
    const { data } = await supabase
      .from("UserCar")
      .select(
        `
        *,
        tasks:MaintenanceTask (*),
        history:ServiceHistory (*),
        reminders:Reminder (*),
        maintenanceChecks:MaintenanceCheck (*),
        documents:CarDocument (*),
        fuelLogs:FuelLog (*),
        catalogCar:CatalogCar (
          year,
          model:CarModel (
            name,
            brand:Brand ( name )
          )
        )
      `,
      )
      .eq("id", targetCarId)
      .single();
    activeCar = data;

    // Generar Signed URLs para el historial de servicios que use el bucket documents
    if (activeCar?.history) {
      activeCar.history = await Promise.all(
        activeCar.history.map(async (h: any) => {
          if (h.imageUrl && h.imageUrl.startsWith("[")) {
            try {
              const paths = JSON.parse(h.imageUrl);
              if (paths.length > 0) {
                const { data: signed } = await supabase.storage
                  .from("documents")
                  .createSignedUrl(paths[0], 3600);
                return { ...h, imageUrl: signed?.signedUrl || h.imageUrl };
              }
            } catch (e) {}
          }
          return h;
        }),
      );
    }
  }

  // 4. Procesar URLs firmadas y nombres
  const processedCars = await Promise.all(
    cars.map(async (c: UserCarSummary) => {
      let url: string | null = c.imageUrl;
      if (url && !url.startsWith("http")) {
        // Handle JSON array format (from mobile)
        if (url.startsWith("[")) {
          try {
            const paths = JSON.parse(url);
            if (paths.length > 0) {
              const { data: signed } = await supabase.storage
                .from("documents")
                .createSignedUrl(paths[0], 3600);
              url = signed?.signedUrl ?? null;
            }
          } catch (e) {}
        } else {
          const { data: signed } = await supabase.storage
            .from("vehicles")
            .createSignedUrl(url, 3600);
          url = signed?.signedUrl ?? null;
        }
      }

      return {
        id: c.id,
        brand: c.brand || c.catalogCar?.model?.brand?.name || "Genérico",
        model: c.model || c.catalogCar?.model?.name || "Vehículo",
        year: c.year || c.catalogCar?.year,
        imageUrl: url,
        licensePlate: c.licensePlate,
      };
    }),
  );

  if (
    activeCar &&
    activeCar.imageUrl &&
    !activeCar.imageUrl.startsWith("http")
  ) {
    if (activeCar.imageUrl.startsWith("[")) {
      try {
        const paths = JSON.parse(activeCar.imageUrl);
        if (paths.length > 0) {
          const { data: signed } = await supabase.storage
            .from("documents")
            .createSignedUrl(paths[0], 3600);
          activeCar.imageUrl = signed?.signedUrl;
        }
      } catch (e) {}
    } else {
      const { data: signed } = await supabase.storage
        .from("vehicles")
        .createSignedUrl(activeCar.imageUrl, 3600);
      activeCar.imageUrl = signed?.signedUrl;
    }
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: (user as any).name,
      plan: user.plan,
    },
    activeCar,
    cars: processedCars,
    activeCarId: activeCar?.id || null,
  };
});
