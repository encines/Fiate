import { createClient } from "./supabase/server";

type TableWithOwner = 'ServiceHistory' | 'MaintenanceTask' | 'Reminder' | 'FuelLog' | 'UserCar'

export async function verifyCarOwnership(userCarId: string, userId: string): Promise<{ valid: boolean; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('UserCar')
    .select('id, userId')
    .eq('id', userCarId)
    .single();

  if (error || !data) {
    return { valid: false, error: "Vehículo no encontrado." };
  }

  if (data.userId !== userId) {
    return { valid: false, error: "No tienes permiso para este vehículo." };
  }

  return { valid: true };
}

export async function verifyRecordOwnership(
  table: TableWithOwner,
  recordId: string,
  userId: string,
  selectQuery: string = 'id, UserCar!inner(userId)'
): Promise<{ valid: boolean; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select(selectQuery)
    .eq('id', recordId)
    .single();

  if (error || !data) {
    return { valid: false, error: "Registro no encontrado." };
  }

  const record = data as { UserCar?: { userId: string } }
  const ownerId = record.UserCar?.userId

  if (ownerId !== userId) {
    return { valid: false, error: "No autorizado." };
  }

  return { valid: true };
}
