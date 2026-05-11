import { createClient } from "../../../lib/supabase/server";
import MaintenancePlanTable from "../../components/MaintenancePlanTable";
import { getActiveCarData } from "../../../lib/get-active-car";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PlanPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Obtenemos los datos del coche activo usando nuestra utilidad de Supabase
  const data = await getActiveCarData();
  
  if (!data?.activeCarId) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Plan de Mantenimiento</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Consulta el programa de servicios y mantenimientos recomendados por el fabricante.</p>
        </div>
        <div className="flex h-64 flex-col items-center justify-center glass-panel p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">Aún no tienes vehículos registrados.</p>
          <p className="mt-2 text-sm text-zinc-500">Agrega un vehículo en Inicio para ver su plan de mantenimiento.</p>
        </div>
      </>
    );
  }

  // El activeCar ya viene con history, tasks y checks de getActiveCarData
  const car = data.activeCar;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">Plan de Mantenimiento</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Consulta el programa de servicios y mantenimientos recomendados por el fabricante.</p>
      </div>

      <MaintenancePlanTable 
        tasks={car.tasks || []} 
        history={[...(car.history || []), ...(car.maintenanceChecks || [])] as any} 
        currentKm={car.currentKm} 
        userCarId={car.id} 
        userPlan={data.user?.plan || "STANDARD"}
      />
    </>
  );
}
