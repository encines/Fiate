import FuelTracker from "../../components/FuelTracker";
import { getActiveCarData } from "../../../lib/get-active-car";
import { createClient } from "../../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FuelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getActiveCarData();

  if (!data?.activeCarId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Selecciona un vehículo para ver su bitácora de combustible.</p>
      </div>
    );
  }

  // Consulta directa a Supabase en lugar de Prisma
  const { data: fuelLogs, error } = await supabase
    .from('FuelLog')
    .select('*')
    .eq('userCarId', data.activeCarId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error cargando fuel logs:", error);
  }

  return (
    <div className="p-8">
      <FuelTracker fuelLogs={(fuelLogs || []) as any} activeCarId={data.activeCarId} />
    </div>
  );
}
