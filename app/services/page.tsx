import ResponsiveLayout from "../components/ResponsiveLayout";
import Services from "../components/services";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const data = await getActiveCarData();
  const session = await auth();
  const resolvedParams = await searchParams;

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    select: { plan: true }
  });

  return (
    <ResponsiveLayout
      cars={data?.cars || []}
      activeCarId={data?.activeCarId}
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      <Services 
        car={data?.activeCar} 
        cars={data?.cars || []} 
        activeCarId={data?.activeCarId} 
        userPlan={user?.plan || "STANDARD"}
        initialFilter={resolvedParams.filter || "Todos"}
        initialPage={Number(resolvedParams.page) || 1}
      />
    </ResponsiveLayout>
  );
}
