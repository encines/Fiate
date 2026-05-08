import Reminders from "../../components/reminders";
import { getActiveCarData } from "../../../lib/get-active-car";

export default async function RemindersPage() {
  const data = await getActiveCarData();

  return <Reminders activeCar={data?.activeCar} />;
}
