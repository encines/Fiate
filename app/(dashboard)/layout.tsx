import ResponsiveLayout from "../../app/components/ResponsiveLayout";
import { getActiveCarData } from "../../lib/get-active-car";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/login");
  }

  const data = await getActiveCarData();

  return (
    <ResponsiveLayout 
      cars={data?.cars || []} 
      activeCarId={data?.activeCarId} 
      catalogCars={[]} 
      userEmail={user.email || "Usuario"}
      userPlan={data?.user?.plan}
    >
      {children}
    </ResponsiveLayout>
  );
}
