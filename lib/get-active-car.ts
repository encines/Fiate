import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { auth } from "../auth";
import { cache } from "react";
import { getSignedUrl } from "./supabase";

/**
 * Obtiene los datos del dashboard.
 * Optimización: Obtiene la lista de autos de forma ligera y solo hace un fetch profundo
 * de las relaciones para el auto que está activo actualmente.
 */
export const getActiveCarData = cache(async () => {
  const session = await auth();
  if (!session?.user?.email) return null;

  // 1. Obtenemos el usuario y la lista básica de sus vehículos
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      plan: true,
      cars: {
        select: {
          id: true,
          imageUrl: true,
          licensePlate: true,
          currentKm: true,
          catalogCar: {
            select: {
              year: true,
              model: {
                select: {
                  name: true,
                  brand: { select: { name: true } }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return null;

  const cookieStore = await cookies();
  const activeCarIdFromCookie = cookieStore.get("fiate_active_car")?.value;
  
  // Validamos que el ID de la cookie realmente pertenezca al usuario
  const cookieCarExists = user.cars.some(c => c.id === activeCarIdFromCookie);
  const targetCarId = cookieCarExists ? activeCarIdFromCookie : user.cars[0]?.id;

  // 2. Fetch profundo SOLO para el vehículo activo
  // Esto reduce drásticamente el tamaño del payload y la carga en DB
  const activeCar = targetCarId ? await prisma.userCar.findUnique({
    where: { id: targetCarId },
    include: {
      tasks: true,
      catalogCar: {
        include: {
          model: {
            include: { brand: true },
          },
        },
      },
      history: {
        orderBy: {
          date: "desc",
        },
        take: 50,
      },
      maintenanceChecks: true,
      documents: true,
      fuelLogs: true,
      reminders: {
        orderBy: {
          date: 'asc'
        }
      },
    },
  }) : null;

  const simplifiedCars = await Promise.all(user.cars.map(async (c) => {
    let finalImageUrl = c.imageUrl;
    if (c.imageUrl && !c.imageUrl.startsWith('data:image')) {
      // Es un path de Supabase, generamos Signed URL
      finalImageUrl = await getSignedUrl(c.imageUrl, 'vehicles');
    }
    
    return {
      id: c.id,
      model: c.catalogCar.model.name,
      brand: c.catalogCar.model.brand.name,
      year: c.catalogCar.year,
      imageUrl: finalImageUrl,
      licensePlate: c.licensePlate,
    };
  }));

  // También procesamos el activeCar si existe
  if (activeCar && activeCar.imageUrl && !activeCar.imageUrl.startsWith('data:image')) {
    activeCar.imageUrl = await getSignedUrl(activeCar.imageUrl, 'vehicles');
  }

  const catalogCars = await prisma.catalogCar.findMany({
    select: {
      id: true,
      year: true,
      model: {
        select: {
          name: true,
          brand: { select: { name: true } }
        }
      }
    }
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan
    },
    activeCar,
    cars: simplifiedCars,
    activeCarId: activeCar?.id || null,
    catalogCars,
  };
});
