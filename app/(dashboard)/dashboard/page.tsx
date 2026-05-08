import Dashboard from "../../components/dashboard";
import { getActiveCarData } from "../../../lib/get-active-car";

export default async function DashboardPage() {
  const data = await getActiveCarData();

  return <Dashboard activeCar={data?.activeCar} />;
}
