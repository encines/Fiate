import MyCar from "../../components/mycar";
import { getActiveCarData } from "../../../lib/get-active-car";

export default async function MyCarPage() {
  const data = await getActiveCarData();

  return <MyCar car={data?.activeCar} />;
}