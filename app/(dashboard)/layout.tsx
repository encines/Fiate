import ResponsiveLayout from "../../app/components/ResponsiveLayout";
import { getActiveCarData } from "../../lib/get-active-car";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const data = await getActiveCarData();

  return (
    <ResponsiveLayout 
      cars={data?.cars || []} 
      activeCarId={data?.activeCarId} 
      catalogCars={data?.catalogCars || []}
      userEmail={session?.user?.email || "Usuario"}
    >
      {children}
    </ResponsiveLayout>
  );
}
