import { createCheckoutSession } from "../actions/createCheckoutSession";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  const isPro = user?.plan === "PRO";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-20 px-4 transition-colors">
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
          Elige tu plan de <span className="text-indigo-500">Fiate</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          Gestiona tus vehículos con precisión profesional y olvídate de las sorpresas mecánicas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plan Estándar */}
        <div className="rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 flex flex-col shadow-xl">
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Estándar</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-zinc-900 dark:text-white">$0</span>
              <span className="text-zinc-500 font-medium">/ siempre</span>
            </div>
          </div>

          <ul className="space-y-4 mb-12 flex-1">
            {[
              "Límite de 1 Vehículo",
              "Historial de Servicios básico",
              "Recordatorios ilimitados",
              "Seguimiento de Combustible",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <svg className="text-emerald-500 h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {feature}
              </li>
            ))}
          </ul>

          <Link 
            href="/dashboard"
            className="w-full py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm uppercase tracking-widest text-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isPro ? "Plan Anterior" : "Plan Actual"}
          </Link>
        </div>

        {/* Plan PRO */}
        <div className="rounded-[32px] border-2 border-indigo-500/50 bg-white dark:bg-zinc-900 p-8 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
            Recomendado
          </div>
          
          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Fiate PRO</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-zinc-900 dark:text-white">$99</span>
              <span className="text-zinc-500 font-medium text-sm">MXN / mes</span>
            </div>
          </div>

          <ul className="space-y-4 mb-12 flex-1">
            {[
              "Vehículos Ilimitados",
              "IA avanzada de mantenimiento",
              "Soporte prioritario",
              "Reportes en PDF exportables",
              "Sin anuncios ni límites",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <svg className="text-indigo-500 h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {feature}
              </li>
            ))}
          </ul>

          {isPro ? (
            <button className="w-full py-4 rounded-2xl bg-indigo-500/10 text-indigo-500 font-bold text-sm uppercase tracking-widest border border-indigo-500/20">
              Plan Activo
            </button>
          ) : (
            <form action={createCheckoutSession}>
              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
              >
                Actualizar a PRO
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
