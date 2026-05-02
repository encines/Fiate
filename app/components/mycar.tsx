import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { auth } from "../../auth";
import EditVehicleModal from "./EditVehicleModal";
import AddVehicleModal from "./AddVehicleModal";
import MaintenancePlanTable from "./MaintenancePlanTable";
import UpdateMileageModal from "./UpdateMileageModal";
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(date);

export default async function MyCar() {
  const session = await auth();

  if (!session?.user?.email) {
    return <div className="p-8 text-white">Sesión no válida o expirada. Por favor inicia sesión nuevamente.</div>;
  }

  // 1. Obtener al usuario autenticado y sus autos
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cars: {
        include: {
          catalogCar: {
            include: {
              model: {
                include: { brand: true },
              },
              tasks: true,
            },
          },
          history: {
            include: { task: true },
            orderBy: { date: "desc" },
          },
        },
      },
    },
  });

  const catalogCars = await prisma.catalogCar.findMany({
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  if (!user || user.cars.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Mi Auto</h2>
        <p className="mb-8 text-zinc-400">Aún no tienes vehículos registrados en tu garaje.</p>
        <AddVehicleModal catalogCars={catalogCars} />
      </div>
    );
  }

  // Obtener auto activo de cookies
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const activeCarId = cookieStore.get("fiate_active_car")?.value;
  const car = user.cars.find(c => c.id === activeCarId) || user.cars[0];
  
  const { catalogCar, history, currentKm } = car;

  // 2. Cálculos básicos
  const lastService = history.length > 0 ? history[0] : null;

  // 3. Tareas próximas (Misma lógica que Dashboard)
  const maintenanceStatus = catalogCar.tasks.map((task) => {
    const lastDone = history.find((h) => h.taskId === task.id);
    const nextDueKm = lastDone && task.frequencyKm
      ? lastDone.kmAtService + task.frequencyKm
      : task.frequencyKm || 0;
    
    const kmRemaining = nextDueKm - currentKm;
    return {
      title: task.name,
      detail: kmRemaining <= 0 ? `Vencido por ${Math.abs(kmRemaining).toLocaleString()} km` : `En ${kmRemaining.toLocaleString()} km`,
      kmRemaining,
    };
  });

  const nextTasks = maintenanceStatus
    .sort((a, b) => a.kmRemaining - b.kmRemaining)
    .slice(0, 3);

  const specs = [
    { label: "Marca", value: catalogCar.model.brand.name },
    { label: "Modelo", value: catalogCar.model.name },
    { label: "Año", value: catalogCar.year.toString() },
    { label: "Color", value: car.color || "No especificado" },
  ];

  const quickStatus = [
    { label: "Kilometraje", value: `${currentKm.toLocaleString()} km`, tone: "text-indigo-300" },
    { label: "Último servicio", value: lastService ? formatDate(lastService.date) : "N/A", tone: "text-teal-300" },
    { label: "Seguro", value: "Vigente", tone: "text-teal-300" }, // Mock
    { label: "Verificación", value: "Pendiente", tone: "text-violet-300" }, // Mock
  ];

  return (
    <div className="view-shell text-zinc-100">
      <section className="space-y-6">
        <div className="glass-panel rounded-[28px] p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">Mi auto</p>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  {catalogCar.model.brand.name} {catalogCar.model.name}
                </h1>
                <p className="mt-2 text-zinc-400">Información general y estado actual del vehículo.</p>
              </div>
              <EditVehicleModal userCar={car} />
            </div>

            <div className="relative aspect-[2.3/1] w-full max-w-md overflow-hidden rounded-[28px] border border-zinc-700/80 bg-zinc-950/60 p-4">
              <Image src="/march.png" alt="My Car" fill className="object-contain" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStatus.map((item) => (
            <article key={item.label} className="glass-panel flex flex-col justify-between rounded-3xl p-5">
              <div>
                <p className="text-sm text-zinc-400">{item.label}</p>
                <p className={`mt-3 text-xl font-semibold ${item.tone}`}>{item.value}</p>
              </div>
              {item.label === "Kilometraje" && (
                <div className="mt-2 text-right">
                  <UpdateMileageModal userCarId={car.id} currentKm={currentKm} />
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Especificaciones</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {specs.map((item) => (
                <div key={item.label} className="soft-card rounded-2xl px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-100">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-lg font-semibold">Próximos mantenimientos</h2>
            <div className="mt-4 space-y-3">
              {nextTasks.map((task) => (
                <div key={task.title} className="soft-card rounded-2xl p-4">
                  <p className="text-sm font-semibold">{task.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{task.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
