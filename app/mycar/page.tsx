import ResponsiveLayout from "../components/ResponsiveLayout";
import MyCar from "../components/mycar";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";

export default async function MyCarPage() {
  const data = await getActiveCarData();
  const session = await auth();

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <MyCar car={data?.activeCar} />
    </ResponsiveLayout>
  );
}