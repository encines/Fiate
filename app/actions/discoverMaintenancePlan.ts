"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAIPlanForCar } from "../../lib/gemini";

// Base de datos de conocimientos de la IA para modelos comunes
const AI_KNOWLEDGE_BASE: Record<string, { name: string; km: number }[]> = {
  "fiat uno": [
    { name: "Cambio de aceite y filtro", km: 10000 },
    { name: "Sustitución de filtro de aire", km: 10000 },
    { name: "Sustitución de filtro de combustible", km: 20000 },
    { name: "Sustitución de bujías", km: 40000 },
    { name: "Control de alineación y rotación", km: 10000 },
    { name: "Sustitución de líquido de frenos", km: 40000 },
    { name: "Revisión de correa de distribución", km: 60000 },
  ],
  "nissan march": [
    { name: "Cambio de aceite y filtro", km: 10000 },
    { name: "Rotación de neumáticos", km: 10000 },
    { name: "Filtro de aire del motor", km: 20000 },
    { name: "Filtro de aire de cabina", km: 20000 },
    { name: "Cambio de bujías", km: 100000 },
    { name: "Cambio de refrigerante", km: 80000 },
  ],
  "toyota corolla": [
    { name: "Aceite de motor y filtro", km: 10000 },
    { name: "Rotación de neumáticos", km: 10000 },
    { name: "Filtro de aire del motor", km: 30000 },
    { name: "Filtro de cabina (A/C)", km: 30000 },
    { name: "Inspección de frenos", km: 20000 },
    { name: "Cambio de líquido de frenos", km: 40000 },
    { name: "Bujías (Iridium)", km: 100000 },
    { name: "Líquido refrigerante", km: 160000 },
  ],
  "nissan versa": [
    { name: "Aceite de motor y filtro", km: 10000 },
    { name: "Filtro de aire del motor", km: 20000 },
    { name: "Filtro de cabina", km: 20000 },
    { name: "Rotación de neumáticos", km: 10000 },
    { name: "Cambio de líquido de frenos", km: 40000 },
    { name: "Bujías de encendido", km: 100000 },
  ],
  "nissan np300": [
    { name: "Aceite de motor y filtro", km: 10000 },
    { name: "Filtro de aire", km: 20000 },
    { name: "Filtro de combustible", km: 30000 },
    { name: "Engrase de chasis/crucetas", km: 10000 },
    { name: "Inspección de frenos y ajuste", km: 10000 },
    { name: "Líquido de transmisión/diferencial", km: 40000 },
  ],
  "chevrolet aveo": [
    { name: "Aceite y filtro de motor", km: 12000 },
    { name: "Filtro de aire y habitáculo", km: 24000 },
    { name: "Filtro de gasolina", km: 24000 },
    { name: "Bujías de encendido", km: 36000 },
    { name: "Líquido de frenos", km: 48000 },
    { name: "Correa de accesorios", km: 60000 },
  ],
  "kia rio": [
    { name: "Aceite y filtro de motor", km: 10000 },
    { name: "Filtro de aire y habitáculo", km: 20000 },
    { name: "Inspección de batería", km: 10000 },
    { name: "Cambio de líquido de frenos", km: 30000 },
    { name: "Bujías de encendido", km: 40000 },
    { name: "Refrigerante de motor", km: 100000 },
  ],
  "volkswagen jetta": [
    { name: "Servicio de aceite y filtro", km: 15000 },
    { name: "Filtro de polvo y polen", km: 30000 },
    { name: "Filtro de aire", km: 30000 },
    { name: "Cambio de bujías", km: 60000 },
    { name: "Líquido de frenos", km: 30000 },
    { name: "Inspección visual de bandas", km: 60000 },
  ],
  "nissan sentra": [
    { name: "Aceite y filtro de motor", km: 10000 },
    { name: "Filtro de aire y cabina", km: 20000 },
    { name: "Rotación de llantas", km: 10000 },
    { name: "Líquido de frenos", km: 40000 },
    { name: "Bujías", km: 100000 },
    { name: "Aceite de transmisión CVT", km: 60000 },
  ],
  "honda civic": [
    { name: "Aceite de motor y filtro", km: 10000 },
    { name: "Rotación de neumáticos", km: 10000 },
    { name: "Filtro de aire del motor", km: 30000 },
    { name: "Filtro de cabina (A/C)", km: 30000 },
    { name: "Inspección de frenos", km: 20000 },
    { name: "Cambio de líquido de frenos", km: 40000 },
    { name: "Bujías de encendido", km: 100000 },
    { name: "Ajuste de válvulas", km: 120000 },
    { name: "Inspección de bandas", km: 20000 },
  ],
  "lamborghini urus": [
    { name: "Cambio de aceite y filtro", km: 15000 },
    { name: "Filtro de aire", km: 30000 },
    { name: "Bujías", km: 60000 },
    { name: "Líquido de frenos", km: 30000 },
    { name: "Inspección de frenos cerámicos", km: 15000 },
    { name: "Aceite de diferencial", km: 60000 },
  ],
  "bmw 3 series": [
    { name: "Aceite de motor y filtro", km: 12000 },
    { name: "Filtro de microaire (Cabina)", km: 24000 },
    { name: "Líquido de frenos", km: 24000 },
    { name: "Bujías", km: 60000 },
    { name: "Inspección de vehículo", km: 24000 },
  ],
  "mercedes-benz c-class": [
    { name: "Servicio A (Aceite y Filtro)", km: 15000 },
    { name: "Servicio B (Filtros y Líquidos)", km: 30000 },
    { name: "Líquido de frenos", km: 30000 },
    { name: "Bujías", km: 75000 },
  ],
  "audi a4": [
    { name: "Cambio de aceite", km: 15000 },
    { name: "Filtro de polen", km: 30000 },
    { name: "Bujías", km: 60000 },
    { name: "Aceite de transmisión S-Tronic", km: 60000 },
    { name: "Líquido de frenos", km: 30000 },
  ],
  generic: [
    { name: "Cambio de aceite y filtro", km: 10000 },
    { name: "Filtro de aire", km: 20000 },
    { name: "Filtro de cabina", km: 20000 },
    { name: "Rotación de llantas", km: 10000 },
    { name: "Líquido de frenos", km: 40000 },
    { name: "Bujías", km: 60000 },
    { name: "Anticongelante", km: 80000 },
  ],
};

export async function discoverMaintenancePlan(userCarId: string) {
  const supabase = await createClient();
  const {
    data: { user: sbUser },
  } = await supabase.auth.getUser();

  if (!sbUser) return { error: "No autorizado." };

  try {
    // 1. Obtener datos del vehículo usando Supabase
    const { data: userCar, error: carError } = await supabase
      .from("UserCar")
      .select(
        `
        id, userId, brand, model, year,
        User(plan),
        catalogCar:CatalogCar (
          year,
          model:CarModel (
            name,
            brand:Brand (name)
          )
        )
      `,
      )
      .eq("id", userCarId)
      .single();

    if (carError || !userCar) return { error: "Vehículo no encontrado." };

    const isPro = (userCar.User as any).plan === "PRO";
    const catalogCar = (userCar as any).catalogCar;
    const brandName = catalogCar
      ? (catalogCar as any).model.brand.name.toLowerCase()
      : (userCar as any).brand.toLowerCase();
    const modelName = catalogCar
      ? (catalogCar as any).model.name.toLowerCase()
      : (userCar as any).model.toLowerCase();
    const year = catalogCar ? (catalogCar as any).year : (userCar as any).year;
    const fullKey = `${brandName} ${modelName}`;

    let plan: { name: string; km: number }[] | null = null;
    let source = "";

    // 2. Buscar en la Base de Datos Local primero
    const { data: catalogEntry } = await supabase
      .from("MaintenanceCatalog")
      .select("tasksJson")
      .eq("key", fullKey)
      .single();

    if (catalogEntry) {
      plan = JSON.parse(catalogEntry.tasksJson);
      source = "la base de datos local";
    } else {
      // 3. Gemini IA para PRO
      if (isPro && process.env.GOOGLE_API_KEY) {
        try {
          console.log(`Buscando plan con Gemini para: ${fullKey} ${year}`);
          plan = await getAIPlanForCar(brandName, modelName, year);

          if (plan) {
            await supabase.from("MaintenanceCatalog").insert({
              key: fullKey,
              tasksJson: JSON.stringify(plan),
            });
            source = "Inteligencia Artificial (Gemini)";
          }
        } catch (aiError) {
          console.error("Gemini falló, usando base estática:", aiError);
        }
      }

      // 4. Fallback estático
      if (!plan) {
        plan =
          AI_KNOWLEDGE_BASE[fullKey] ||
          Object.entries(AI_KNOWLEDGE_BASE).find(([key]) =>
            fullKey.includes(key),
          )?.[1] ||
          AI_KNOWLEDGE_BASE["generic"];
        source = isPro
          ? "el catálogo estático de respaldo"
          : "el catálogo estándar (Pásate a PRO para usar Inteligencia Artificial)";
      }
    }

    if (!plan || plan.length === 0) {
      return {
        error: `No se pudo generar un plan de mantenimiento para ${brandName} ${modelName}.`,
      };
    }

    // 5. Limpiar tareas existentes
    await supabase.from("MaintenanceTask").delete().eq("userCarId", userCarId);

    // 6. Crear las nuevas tareas
    const { error: insertError } = await supabase
      .from("MaintenanceTask")
      .insert(
        plan.map((task) => ({
          name: task.name,
          frequencyKm: task.km,
          userCarId: userCarId,
        })),
      );

    if (insertError) throw insertError;

    revalidatePath("/plan");
    return {
      success: true,
      message: `Plan para ${brandName} ${modelName} generado exitosamente desde ${source}.`,
    };
  } catch (error) {
    console.error(error);
    return { error: "Error durante el descubrimiento por IA." };
  }
}
