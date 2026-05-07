import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";

export default function Dashboard({ activeCar }: { activeCar: any }) {

  const serviceHistory = activeCar?.history?.slice(0, 5) || [];
  
  // Lógica de Health Score Premium
  const calculateHealth = () => {
    if (!activeCar || !activeCar.tasks || activeCar.tasks.length === 0) return 100;
    
    const tasks = activeCar.tasks;
    const checks = activeCar.maintenanceChecks || [];
    const currentKm = activeCar.currentKm;
    
    let totalExpectedChecks = 0;
    tasks.forEach((t: any) => {
      if (t.frequencyKm && t.frequencyKm > 0) {
        totalExpectedChecks += Math.floor(currentKm / t.frequencyKm);
      }
    });

    if (totalExpectedChecks === 0) return 100;
    
    const completedCount = checks.length;
    const score = Math.max(0, Math.min(100, Math.round((completedCount / totalExpectedChecks) * 100)));
    return score;
  };

  const healthScore = useMemo(() => calculateHealth(), [activeCar]);
  const totalSpent = useMemo(() => activeCar?.history?.reduce((acc: number, curr: any) => acc + (curr.cost || 0), 0) || 0, [activeCar?.history]);

  const stats = [
    {
      label: "Salud del Auto",
      value: `${healthScore}%`,
      meta: healthScore > 90 ? "Excelente" : healthScore > 70 ? "Regular" : "Crítico",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
      color: healthScore > 90 ? "text-emerald-500" : healthScore > 70 ? "text-amber-500" : "text-rose-500",
      bg: healthScore > 90 ? "bg-emerald-500/10" : healthScore > 70 ? "bg-amber-500/10" : "bg-rose-500/10"
    },
    {
      label: "Inversión Total",
      value: `$${totalSpent.toLocaleString()}`,
      meta: "en mantenimientos",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 7h5c2.2 0 4 1.8 4 4s-1.8 4-4 4H2"/><path d="M22 17h-5c-2.2 0-4-1.8-4-4s1.8-4 4-4h5"/></svg>,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Kilometraje",
      value: activeCar ? `${activeCar.currentKm.toLocaleString()} km` : "0 km",
      meta: "recorridos",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Próximo Servicio",
      value: activeCar?.tasks?.[0] ? `${activeCar.tasks[0].frequencyKm?.toLocaleString()} km` : "N/A",
      meta: "estimado",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
  ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 sm:p-8 custom-scrollbar overflow-y-auto transition-colors">
      <section className="space-y-8 max-w-7xl mx-auto">
        {/* Main Hero Card */}
        <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-md overflow-hidden relative group transition-colors">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-zinc-500/5 blur-[100px] group-hover:bg-zinc-500/10 transition-colors duration-700"></div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="max-w-2xl space-y-6 w-full">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  Vehículo activo
                </p>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight sm:text-4xl lg:text-5xl">
                  {activeCar?.catalogCar?.model 
                    ? `${activeCar.catalogCar.model.brand.name} ${activeCar.catalogCar.model.name}` 
                    : "Selecciona un vehículo"}
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
                  {activeCar?.catalogCar 
                    ? `${activeCar.catalogCar.year} · ${activeCar.catalogCar.trim || ""} · ${activeCar.licensePlate || "Sin placas"}` 
                    : ""}
                </p>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/50 p-4 sm:p-5 group/item hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kilometraje</p>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {activeCar?.currentKm.toLocaleString() || 0} <span className="text-sm font-medium text-zinc-500">KM</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/50 p-4 sm:p-5 group/item hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Último servicio</p>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {activeCar?.history?.[0]?.date 
                      ? new Date(activeCar.history[0].date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                      : "N/A"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/50 p-4 sm:p-5 group/item hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Servicios</p>
                  <p className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {activeCar?.history?.length || 0} <span className="text-sm font-medium text-zinc-500">REG</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video w-full lg:max-w-md">
              <div className="absolute inset-0 bg-zinc-500/5 rounded-[40px] blur-2xl"></div>
              <div className="relative h-full w-full rounded-[32px] bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex items-center justify-center">
                <Image
                  src={activeCar?.imageUrl || "/march.png"}
                  alt="Vehículo"
                  width={400}
                  height={250}
                  className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-48 sm:max-h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/20 p-6 hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.meta}</span>
              </div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Premium Analytics Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Health Gauge Card */}
          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-8 backdrop-blur-md flex items-center gap-8 group">
            <div className="relative h-32 w-32 flex-shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${healthScore > 90 ? "stroke-emerald-500" : healthScore > 70 ? "stroke-amber-500" : "stroke-rose-500"} transition-all duration-1000 ease-out`}
                  strokeWidth="3"
                  strokeDasharray={`${healthScore}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{healthScore}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Salud</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Estado Mecánico</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {healthScore > 90 
                  ? "Tu vehículo está en condiciones óptimas. Sigue así para mantener su valor."
                  : healthScore > 70 
                  ? "Tienes algunos servicios pendientes. Programarlos pronto evitará averías costosas."
                  : "¡Atención! Tu vehículo requiere mantenimiento urgente para garantizar su seguridad."}
              </p>
            </div>
          </div>

          {/* Resale Value Card */}
          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-8 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 7h5c2.2 0 4 1.8 4 4s-1.8 4-4 4H2"/><path d="M22 17h-5c-2.2 0-4-1.8-4-4s1.8-4 4-4h5"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Confianza de Mercado</p>
              <h3 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">Valor de Reventa</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">
                  +{healthScore > 80 ? "15" : healthScore > 50 ? "8" : "3"}%
                </span>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">sobre el valor base</span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Basado en tu historial impecable y mantenimientos certificados.
              </p>
            </div>
          </div>
        </div>

        {/* History and Upcoming Grid */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Servicios Recientes</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Últimos mantenimientos registrados.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent px-4 py-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500 hover:text-indigo-600 dark:hover:text-white transition-all"
              >
                Ver todos
              </Link>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 custom-scrollbar">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Servicio</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Kilometraje</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Costo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                  {serviceHistory.length > 0 ? (
                    serviceHistory.map((item: any) => (
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group"
                      >
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {new Date(item.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                          {item.customName || "Mantenimiento"}
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 text-right font-medium">
                          {item.kmAtService.toLocaleString()} <span className="text-[10px]">KM</span>
                        </td>
                        <td className="px-6 py-4 text-zinc-900 dark:text-white text-right font-bold">
                          ${item.cost?.toLocaleString() || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                        No hay servicios recientes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/30 p-8 backdrop-blur-sm flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recordatorios</h2>
                <p className="mt-1 text-sm text-zinc-500">Próximos eventos importantes.</p>
              </div>
              <Link
                href="/reminders"
                className="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300"
              >
                Gestionar
              </Link>
            </div>

            <div className="flex-1 space-y-4">
              {activeCar?.reminders?.length > 0 ? (
                activeCar.reminders.slice(0, 3).map((reminder: any) => (
                  <div key={reminder.id} className="group relative flex items-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/20 p-4 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{reminder.title}</p>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                        {new Date(reminder.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })}
                      </p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20">
                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                  </div>
                  <p className="text-sm text-zinc-500 px-4">No tienes recordatorios próximos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
