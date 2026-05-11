import Image from "next/image";
import { createClient } from "../../lib/supabase/server";
import EditVehicleModal from "./EditVehicleModal";
import AddVehicleModal from "./AddVehicleModal";
import UpdateMileageModal from "./UpdateMileageModal";

interface MyCarProps {
  car: any;
}

export default async function MyCar({ car }: MyCarProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return <div className="p-8 text-zinc-900 dark:text-white">Sesión no válida o expirada. Por favor inicia sesión nuevamente.</div>;
  }

  if (!car) {
    // Consulta directa a Supabase en lugar de Prisma
    const { data: catalogCars } = await supabase
      .from('CatalogCar')
      .select(`
        *,
        model:CarModel (
          *,
          brand:Brand (*)
        )
      `);

    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-900 dark:text-white">
        <h2 className="mb-4 text-2xl font-bold">Mi Auto</h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">Aún no tienes vehículos registrados en tu garaje.</p>
        <AddVehicleModal catalogCars={(catalogCars || []) as any} />
      </div>
    );
  }

  const { catalogCar, history, currentKm, documents = [], fuelLogs = [] } = car;

  // 1. Cálculos de Eficiencia y Costo
  const totalServiceCost = history.reduce((sum: number, h: any) => sum + (h.cost || 0), 0);
  const totalFuelCost = fuelLogs.reduce((sum: number, f: any) => sum + (f.totalCost || 0), 0);
  
  let avgConsumption = 0;
  if (fuelLogs.length >= 2) {
    const sortedLogs = [...fuelLogs].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const kmDiff = sortedLogs[sortedLogs.length - 1].km - sortedLogs[0].km;
    const totalLiters = sortedLogs.slice(1).reduce((sum: number, f: any) => sum + f.liters, 0);
    avgConsumption = kmDiff > 0 ? kmDiff / totalLiters : 0;
  }

  // 2. Estado de Documentos (Dinámico)
  const getDocStatus = (type: string) => {
    const doc = documents.find((d: any) => d.type === type);
    if (!doc) return { value: "Pendiente", tone: "bg-amber-500/10 text-amber-500", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg> };
    const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
    return isExpired 
      ? { value: "Vencido", tone: "bg-rose-500/10 text-rose-500", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg> }
      : { value: "Vigente", tone: "bg-emerald-500/10 text-emerald-500", icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> };
  };

  const seguroStatus = getDocStatus("Seguro");
  const tarjetaStatus = getDocStatus("Tarjeta de Circulación");

  const quickStatus = [
    { label: "Kilometraje", value: `${currentKm.toLocaleString()} km`, tone: "text-zinc-900 dark:text-white", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>, sub: "Actualizar ahora" },
    { label: "Rendimiento", value: avgConsumption > 0 ? `${avgConsumption.toFixed(1)} km/L` : "N/D", tone: "text-zinc-900 dark:text-white", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22L7 18"/><path d="M6 18h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6"/><path d="M2 13h15"/><path d="M22 7l-2 2"/></svg>, sub: "Basado en cargas" },
    { label: "Seguro", value: seguroStatus.value, type: "badge", tone: seguroStatus.tone, icon: seguroStatus.icon, href: "/documents" },
    { label: "Tarjeta de Circulación", value: tarjetaStatus.value, type: "badge", tone: tarjetaStatus.tone, icon: tarjetaStatus.icon, href: "/documents" },
  ];

  const specs = [
    { label: "Marca", value: catalogCar?.model?.brand?.name || car.brand || "Genérico" },
    { label: "Modelo", value: catalogCar?.model?.name || car.model || "Vehículo" },
    { label: "Año", value: (catalogCar?.year || car.year || "").toString() },
    { label: "Color", value: car.color || "No especificado" },
  ];

  return (
    <div className="view-shell text-zinc-900 dark:text-zinc-100 transition-colors pb-12">
      <section className="space-y-8">
        {/* Main Hero Card */}
        <div className="relative overflow-hidden glass-panel rounded-[40px] p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-zinc-500/5 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-zinc-500/5 blur-[100px]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
                    Vehículo Activo
                  </span>
                  <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ID: {car.id.slice(-6)}</span>
                </div>
                <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-none">
                  {catalogCar?.model?.brand?.name || car.brand || "Genérico"} <span className="text-indigo-500 dark:text-indigo-400">{catalogCar?.model?.name || car.model || "Vehículo"}</span>
                </h1>
                <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400 font-medium">
                  Modelo {catalogCar?.year || car.year || ""} · {car.licensePlate || "Sin Placas"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <EditVehicleModal userCar={car} />
              </div>
            </div>

            <div className="relative aspect-[2/1] w-full max-w-2xl group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image src={car.imageUrl || "/march.png"} alt="My Car" fill sizes="(max-width: 672px) 100vw, 672px" className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <a href="/services" className="flex items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Historial de Servicio</span>
          </a>
          <a href="/fuel" className="flex items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22L7 18"/><path d="M6 18h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6"/><path d="M2 13h15"/><path d="M22 7l-2 2"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Gasolina</span>
          </a>
          <a href="/documents" className="flex items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-wider">Documentos</span>
          </a>
        </div>

        {/* Info Grid */}
        <div className="grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-8">
            {/* Real Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {quickStatus.map((item) => (
                <article key={item.label} className="glass-panel group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-6 hover:border-indigo-500/30 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.label}</p>
                      <div className="text-zinc-400 group-hover:text-indigo-500 transition-colors">{item.icon}</div>
                    </div>
                    {item.type === "badge" ? (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest ${item.tone}`}>
                          {item.icon} {item.value}
                        </span>
                      </div>
                    ) : (
                      <p className={`text-3xl font-black ${item.tone}`}>{item.value}</p>
                    )}
                  </div>
                  {item.label === "Kilometraje" && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <UpdateMileageModal userCarId={car.id} currentKm={currentKm} />
                    </div>
                  )}
                  {item.href && <a href={item.href} className="absolute inset-0 z-0" />}
                </article>
              ))}
            </div>

            {/* Financial Insight */}
            <div className="glass-panel rounded-[40px] p-8 border-l-8 border-indigo-500">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Inversión Total</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mantenimiento + Combustible</p>
                </div>
                <p className="text-3xl font-black text-indigo-500">${(totalServiceCost + totalFuelCost).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Servicios</p>
                  <p className="font-bold text-zinc-900 dark:text-white">${totalServiceCost.toLocaleString()}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Combustible</p>
                  <p className="font-bold text-zinc-900 dark:text-white">${totalFuelCost.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[40px] p-8 border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 text-zinc-900 dark:text-white">Ficha Técnica</h2>
              <div className="space-y-4">
                {specs.map((item) => (
                  <div key={item.label} className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
