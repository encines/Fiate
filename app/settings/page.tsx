import ResponsiveLayout from "../components/ResponsiveLayout";
import Settings from "../components/settings";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";

export default async function SettingsPage() {
  const data = await getActiveCarData();
  const session = await auth();

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <Settings car={data?.activeCar} />
    </ResponsiveLayout>
  );
}
