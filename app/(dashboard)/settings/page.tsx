import Settings from "../../components/settings";
import { getActiveCarData } from "../../../lib/get-active-car";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const data = await getActiveCarData();
  
  if (!data) {
    redirect("/login");
  }

  return (
    <Settings 
      cars={data.cars || []} 
      car={data.activeCar} 
      user={data.user} 
    />
  );
}
