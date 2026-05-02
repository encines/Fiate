"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

// Base de datos de conocimientos de la IA para modelos comunes
// En una fase posterior, esto usaría una búsqueda web real + LLM
const AI_KNOWLEDGE_BASE: Record<string, { name: string, km: number }[]> = {
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
  ]
};

export async function discoverMaintenancePlan(userCarId: string) {
  try {
    const userCar = await prisma.userCar.findUnique({
      where: { id: userCarId },
      include: { catalogCar: { include: { model: { include: { brand: true } } } } }
    });

    if (!userCar) return { error: "Vehículo no encontrado." };

    const brandName = userCar.catalogCar.model.brand.name.toLowerCase();
    const modelName = userCar.catalogCar.model.name.toLowerCase();
    const fullKey = `${brandName} ${modelName}`;
    
    // 1. Intentar buscar en la nueva Enciclopedia Profesional (Base de Datos)
    let catalogEntry = await prisma.maintenanceCatalog.findUnique({
      where: { key: fullKey }
    });

    // Búsqueda difusa si no es exacta (ej. "Nissan Versa 2025" -> "nissan versa")
    if (!catalogEntry) {
      catalogEntry = await prisma.maintenanceCatalog.findFirst({
        where: {
          OR: [
            { key: { contains: modelName } },
            { key: { contains: brandName } }
          ]
        }
      });
    }

    let plan: { name: string, km: number }[] | null = null;

    if (catalogEntry) {
      plan = JSON.parse(catalogEntry.tasksJson);
    } else {
      // Fallback a la base de conocimientos antigua si no está en la DB
      plan = AI_KNOWLEDGE_BASE[fullKey] || 
             Object.entries(AI_KNOWLEDGE_BASE).find(([key]) => fullKey.includes(key))?.[1] || null;
    }

    if (!plan) {
      return { error: `La IA aún no tiene el plan específico para ${brandName} ${modelName}.` };
    }

    // Limpiar tareas existentes
    await prisma.maintenanceTask.deleteMany({
      where: { catalogCarId: userCar.catalogCarId }
    });

    // Crear las nuevas tareas
    await Promise.all(plan.map(task => 
      prisma.maintenanceTask.create({
        data: {
          name: task.name,
          frequencyKm: task.km,
          catalogCarId: userCar.catalogCarId
        }
      })
    ));

    revalidatePath("/plan");
    return { success: true, message: `Plan para ${brandName} ${modelName} generado exitosamente desde el catálogo.` };
  } catch (error) {
    console.error(error);
    return { error: "Error durante el descubrimiento por IA." };
  }
}
