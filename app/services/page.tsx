import ResponsiveLayout from "../components/ResponsiveLayout";
import Services from "../components/services";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";

export default async function ServicesPage() {
  const data = await getActiveCarData();
  const session = await auth();

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <Services car={data?.activeCar} />
    </ResponsiveLayout>
  );
}
