import Image from "next/image";

export default function Landing() {
  return (
    <div>
      <div className="min-h-screen bg-transparent text-white flex ">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <section className="max-w-2xl space-y-8 lg:pr-10">
            <span className="inline-flex rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-100">
              Keep Your Car Running Like New
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                Todo lo que necesitas para mantener tu auto.
              </h1>
              <p className="text-lg text-slate-200/90">
                La app todo en uno para rastrear servicios, recibir alertas y
                maximizar la vida útil de tu vehículo desde un mismo lugar.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400">
                Comenzar gratis
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-300/20 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800">
                Ver cómo funciona
              </button>
            </div>
          </section>

          <div className="relative flex w-full max-w-xl flex-col gap-8 rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:p-8">
            <div className="absolute -right-8 top-8 hidden h-64 w-64 rounded-full bg-orange-500/20 blur-3xl lg:block" />
            <Image
              src="/march.png"
              alt="marcherati"
              width={420}
              height={420}
              className="rounded-3xl object-cover"
            />
            <div className="rounded-3xl bg-slate-900/95 p-5 text-slate-100 shadow-inner shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    2023 Tesla Model 3
                  </p>
                  <p className="mt-2 text-xl font-semibold">Health: Optimal</p>
                </div>
                <div className="rounded-full bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200">
                  Active
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-800/95 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Next Service
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    In 2,400 mi
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-800/95 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Tire Rotation
                  </p>
                  <p className="mt-2 text-sm font-semibold text-orange-400">
                    Due Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
              Everything You Need for Perfect Maintenance
            </p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Todo lo que necesitas para mantener tu auto.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
              Cuida tu vehículo con seguimiento de servicios, alertas
              automáticas y un historial que aumenta su valor.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                🔧
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Service Tracking
              </h3>
              <p className="mt-3 text-slate-600">
                Registra cada cambio de aceite, mantenimiento y reparación con
                un historial preciso y fácil de consultar.
              </p>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                ⚠️
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Alertas de Mantenimiento
                </h3>
                <p className="mt-3 text-slate-600">
                  Notificaciones inteligentes según el kilometraje exacto y las
                  especificaciones de tu vehículo.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Brake Pads
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    Inspect Now
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Oil Change
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    In 500 Miles
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Historial de servicios y reventas
                </h3>
                <p className="mt-3 text-slate-600">
                  Registros digitales que aumentan el valor de reventa de tu
                  auto. Exporta reportes completos que comprueban un
                  mantenimiento impecable.
                </p>
              </div>
              <div className="space-y-4 rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="font-medium text-slate-900">
                    Synthetic Oil Change
                  </span>
                  <span className="text-sm text-slate-500">Oct 12, 2023</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="font-medium text-slate-900">
                    4-Wheel Alignment
                  </span>
                  <span className="text-sm text-slate-500">Aug 05, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
