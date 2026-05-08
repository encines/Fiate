import FuelTracker from "../../components/FuelTracker";
import { getActiveCarData } from "../../../lib/get-active-car";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export default async function FuelPage() {
  const data = await getActiveCarData();
  const session = await auth();

  if (!data?.activeCarId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-zinc-500">Selecciona un vehículo para ver su bitácora de combustible.</p>
      </div>
    );
  }

  const fuelLogs = await prisma.fuelLog.findMany({
    where: { userCarId: data.activeCarId },
    orderBy: { date: "desc" }
  });

  return (
    <div className="p-8">
      <FuelTracker fuelLogs={fuelLogs as any} activeCarId={data.activeCarId} />
    </div>
  );
}
