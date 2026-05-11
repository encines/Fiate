import Reminders from "../../components/reminders";
import { getActiveCarData } from "../../../lib/get-active-car";
import { redirect } from "next/navigation";

export default async function RemindersPage() {
  const data = await getActiveCarData();
  
  if (!data) {
    redirect("/login");
  }

  return <Reminders activeCar={data.activeCar} />;
}
