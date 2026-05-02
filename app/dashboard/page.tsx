import Dashboard from "../components/dashboard";
import ResponsiveLayout from "../components/ResponsiveLayout";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";

export default async function DashboardPage() {
  const data = await getActiveCarData();
  const session = await auth();

  return (
    <ResponsiveLayout 
      cars={data?.cars || []} 
      activeCarId={data?.activeCarId} 
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <Dashboard activeCar={data?.activeCar} />
    </ResponsiveLayout>
  );
}
