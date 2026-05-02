import ResponsiveLayout from "../components/ResponsiveLayout";
import Reminders from "../components/reminders";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";

export default async function RemindersPage() {
  const data = await getActiveCarData();
  const session = await auth();

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <Reminders activeCar={data?.activeCar} />
    </ResponsiveLayout>
  );
}
