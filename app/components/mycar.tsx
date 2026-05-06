import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import EditVehicleModal from "./EditVehicleModal";
import AddVehicleModal from "./AddVehicleModal";
import MaintenancePlanTable from "./MaintenancePlanTable";
import UpdateMileageModal from "./UpdateMileageModal";
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);

interface MyCarProps {
  car: any;
}

export default async function MyCar({ car }: MyCarProps) {
  const session = await auth();

  if (!session?.user?.email) {
    return <div className="p-8 text-zinc-900 dark:text-white">Sesión no válida o expirada. Por favor inicia sesión nuevamente.</div>;
  }

  if (!car) {
    const catalogCars = await prisma.catalogCar.findMany({
      include: {
        model: {
          include: { brand: true },
        },
      },
    });

    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-900 dark:text-white">
        <h2 className="mb-4 text-2xl font-bold">Mi Auto</h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">Aún no tienes vehículos registrados en tu garaje.</p>
        <AddVehicleModal catalogCars={catalogCars} />
      </div>
    );
  }

  const { catalogCar, history, currentKm } = car;

  // 2. Cálculos básicos e Indicador de Salud
  const lastService = history.length > 0 ? history[0] : null;
  
  // Calcular salud (basado en tareas vencidas)
  const allTasks = catalogCar.tasks || [];
  const overdueCount = (allTasks as any[]).filter(task => {
    const lastDone = history.find((h: any) => h.taskId === task.id);
    const nextDueKm = lastDone && task.frequencyKm ? lastDone.kmAtService + task.frequencyKm : task.frequencyKm || 0;
    return (nextDueKm - currentKm) <= 0;
  }).length;
  
  const healthScore = allTasks.length > 0 ? Math.max(0, 100 - (overdueCount * (100 / allTasks.length))) : 100;
  const healthColor = healthScore > 80 ? "text-emerald-500" : healthScore > 50 ? "text-amber-500" : "text-rose-500";

  // 3. Tareas próximas
  const maintenanceStatus = (catalogCar.tasks || []).map((task: any) => {
    const lastDone = history.find((h: any) => h.taskId === task.id);
    const nextDueKm = lastDone && task.frequencyKm
      ? lastDone.kmAtService + task.frequencyKm
      : task.frequencyKm || 0;
    
    const kmRemaining = nextDueKm - currentKm;
    return {
      title: task.name,
      detail: kmRemaining <= 0 ? `Vencido por ${Math.abs(kmRemaining).toLocaleString()} km` : `En ${kmRemaining.toLocaleString()} km`,
      kmRemaining,
      isOverdue: kmRemaining <= 0,
    };
  });

  const nextTasks = maintenanceStatus
    .sort((a: any, b: any) => a.kmRemaining - b.kmRemaining)
    .slice(0, 3);

  const specs = [
    { label: "Marca", value: catalogCar.model.brand.name },
    { label: "Modelo", value: catalogCar.model.name },
    { label: "Año", value: catalogCar.year.toString() },
    { label: "Color", value: car.color || "No especificado" },
  ];

  const quickStatus = [
    { 
      label: "Kilometraje", 
      value: `${currentKm.toLocaleString()} km`, 
      tone: "text-indigo-500 dark:text-indigo-400",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
    },
    { 
      label: "Último servicio", 
      value: lastService ? formatDate(lastService.date) : "N/A", 
      tone: "text-teal-500 dark:text-teal-400",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    },
    { 
      label: "Seguro", 
      value: "Vigente", 
      type: "badge",
      tone: "bg-emerald-500/10 text-emerald-500",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    },
    { 
      label: "Verificación", 
      value: "Pendiente", 
      type: "badge",
      tone: "bg-amber-500/10 text-amber-500",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    },
  ];

  return (
    <div className="view-shell text-zinc-900 dark:text-zinc-100 transition-colors">
      <section className="space-y-8">
        {/* Main Header Card */}
        <div className="relative overflow-hidden glass-panel rounded-[40px] p-8 sm:p-10">
          {/* Background Glow */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-teal-500/5 blur-[100px]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Vehículo Activo
                </span>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  {catalogCar.model.brand.name} <span className="text-indigo-500">{catalogCar.model.name}</span>
                </h1>
                <p className="max-w-md text-base text-zinc-500 dark:text-zinc-400">
                  {catalogCar.year} · Gestión integral de mantenimiento y documentación.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <EditVehicleModal userCar={car} />
                <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-100 dark:text-zinc-800" />
                      <circle 
                        cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" 
                        strokeDasharray={125} 
                        strokeDashoffset={125 - (125 * healthScore) / 100}
                        className={`${healthColor} transition-all duration-1000`}
                      />
                    </svg>
                    <span className={`text-xs font-black ${healthColor}`}>{Math.round(healthScore)}%</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Salud del Auto</p>
                    <p className="text-sm font-bold">{healthScore > 80 ? "Excelente" : healthScore > 50 ? "Regular" : "Requiere Atención"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[2/1] w-full max-w-xl group">
              {/* Image Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image 
                src="/march.png" 
                alt="My Car" 
                fill 
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)] transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStatus.map((item) => (
            <article key={item.label} className="glass-panel group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 transition-all hover:border-indigo-500/30">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{item.label}</p>
                  <div className="text-zinc-400 group-hover:text-indigo-500 transition-colors">{item.icon}</div>
                </div>
                
                {item.type === "badge" ? (
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black ${item.tone}`}>
                      {item.icon}
                      {item.value}
                    </span>
                  </div>
                ) : (
                  <p className={`text-2xl font-black ${item.tone}`}>{item.value}</p>
                )}
              </div>

              {item.label === "Kilometraje" && (
                <div className="relative z-10 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <UpdateMileageModal userCarId={car.id} currentKm={currentKm} />
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Specifications & Timeline */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          {/* Specifications */}
          <div className="glass-panel rounded-[40px] p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 rounded-full bg-indigo-500" />
              <h2 className="text-xl font-black uppercase tracking-tight">Ficha Técnica</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {specs.map((item) => (
                <div key={item.label} className="soft-card rounded-3xl p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-base font-black text-zinc-900 dark:text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Maintenance Timeline */}
          <div className="glass-panel rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-teal-500" />
                <h2 className="text-xl font-black uppercase tracking-tight">Próximos Pasos</h2>
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mantenimiento</span>
            </div>

            <div className="space-y-6">
              {nextTasks.length > 0 ? nextTasks.map((task: any, idx: number) => (
                <div key={task.title} className="relative flex gap-6 group">
                  {/* Timeline line */}
                  {idx !== nextTasks.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-0.5 bg-zinc-100 dark:bg-zinc-800" />
                  )}
                  
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white dark:border-zinc-950 transition-colors ${task.isOverdue ? "bg-rose-500" : "bg-teal-500"}`}>
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </div>

                  <div className="space-y-1 pb-4">
                    <p className={`text-sm font-black uppercase tracking-tight ${task.isOverdue ? "text-rose-500" : "text-zinc-900 dark:text-white"}`}>
                      {task.title}
                    </p>
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                      {task.detail}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <p className="text-sm font-bold text-zinc-500">¡Tu auto está al día! No hay mantenimientos próximos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
