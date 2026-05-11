import MyCar from "../../components/mycar";
import { getActiveCarData } from "../../../lib/get-active-car";
import { redirect } from "next/navigation";

export default async function MyCarPage() {
  const data = await getActiveCarData();
  
  if (!data) {
    redirect("/login");
  }

  return <MyCar car={data.activeCar} />;
}