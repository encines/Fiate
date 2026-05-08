import Settings from "../../components/settings";
import { getActiveCarData } from "../../../lib/get-active-car";

export default async function SettingsPage() {
  const data = await getActiveCarData();

  return <Settings cars={data?.cars || []} car={data?.activeCar} />;
}
