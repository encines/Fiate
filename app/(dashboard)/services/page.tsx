import Services from "../../components/services";
import { getActiveCarData } from "../../../lib/get-active-car";
import { redirect } from "next/navigation";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const data = await getActiveCarData();
  
  if (!data) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;

  return (
    <Services 
      car={data.activeCar} 
      cars={data.cars || []} 
      activeCarId={data.activeCarId} 
      userPlan={data.user.plan || "STANDARD"}
      initialFilter={resolvedParams.filter || "Todos"}
      initialPage={Number(resolvedParams.page) || 1}
    />
  );
}
