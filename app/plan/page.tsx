import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import MaintenancePlanTable from "../components/MaintenancePlanTable";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { getActiveCarData } from "../../lib/get-active-car";
import { cookies } from "next/headers";

export default async function PlanPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div className="p-8 text-white">Sesión no válida o expirada. Por favor inicia sesión nuevamente.</div>;
  }

  const data = await getActiveCarData();
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cars: {
        include: {
          catalogCar: {
            include: {
              model: { include: { brand: true } },
            },
          },
          tasks: true,
          history: {
            include: { task: true },
            orderBy: { date: "desc" },
          },
          maintenanceChecks: true,
        },
      },
    },
  });

  const cookieStore = await cookies();
  const activeCarId = cookieStore.get("fiate_active_car")?.value;
  const car = user?.cars.find(c => c.id === activeCarId) || user?.cars[0];

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Plan de Mantenimiento</h1>
        <p className="mt-2 text-zinc-400">Consulta el programa de servicios y mantenimientos recomendados por el fabricante.</p>
      </div>

      {!car ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-zinc-700/80 bg-zinc-900/50 p-8 text-center backdrop-blur-md">
          <p className="text-zinc-400">Aún no tienes vehículos registrados.</p>
          <p className="mt-2 text-sm text-zinc-500">Agrega un vehículo en Inicio para ver su plan de mantenimiento.</p>
        </div>
      ) : (
        <MaintenancePlanTable 
          tasks={car.tasks || []} 
          history={[...(car.history || []), ...(car.maintenanceChecks || [])] as any} 
          currentKm={car.currentKm} 
          userCarId={car.id} 
        />
      )}
    </ResponsiveLayout>
  );
}
