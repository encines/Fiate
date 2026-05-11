import Dashboard from "../../components/dashboard";
import { getActiveCarData } from "../../../lib/get-active-car";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await getActiveCarData();

  // Si no hay datos ni usuario, algo fue mal con la sesión
  if (!data) {
    redirect("/login");
  }

  return (
    <Dashboard activeCar={data.activeCar} />
  );
}
