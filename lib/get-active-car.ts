import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { auth } from "../auth";

export async function getActiveCarData() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cars: {
        include: {
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
          },
        },
      },
    },
  });

  const catalogCars = await prisma.catalogCar.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  if (!user || user.cars.length === 0) {
    return {
      user: user || null,
      activeCar: null,
      cars: [],
      activeCarId: null,
      catalogCars,
    };
  }

  const cookieStore = await cookies();
  const activeCarId = cookieStore.get("fiate_active_car")?.value;

  const activeCar = user.cars.find((c) => c.id === activeCarId) || user.cars[0];

  const simplifiedCars = user.cars.map((c) => ({
    id: c.id,
    model: c.catalogCar.model.name,
    brand: c.catalogCar.model.brand.name,
    year: c.catalogCar.year,
  }));

  return {
    user,
    activeCar,
    cars: simplifiedCars,
    activeCarId: activeCar.id,
    catalogCars,
  };
}
