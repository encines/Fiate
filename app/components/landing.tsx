import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white selection:bg-indigo-500/30 font-sans">
      {/* Texture Layer: Grain & Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      <div className="absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Dynamic Light Sources */}
      <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse transform-gpu" />
      <div className="absolute top-[20%] -right-[5%] h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[140px] transform-gpu" />
      <div className="absolute bottom-[-10%] left-[20%] h-[400px] w-[800px] rounded-full bg-indigo-500/5 blur-[120px] transform-gpu" />

      {/* Hero Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-48 lg:px-12 lg:pt-48">
        <div className="flex flex-col items-center gap-24 lg:flex-row lg:items-start lg:justify-between">
          <section className="max-w-3xl space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Plataforma de Gestión Automotriz 2026</span>
            </div>
            
            <div className="space-y-8">
              <h1 className="text-6xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-8xl lg:text-[100px]">
                El arte de <br />
                <span className="bg-gradient-to-r from-indigo-400 via-white to-teal-400 bg-clip-text text-transparent">cuidar tu motor.</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-zinc-500 lg:mx-0 lg:text-xl">
                Fiate redefine la relación con tu vehículo. Una suite de herramientas de precisión para quienes ven en su auto más que un medio de transporte.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row lg:justify-start">
              <Link href="/register" className="relative flex h-16 items-center justify-center rounded-full bg-white px-12 text-sm font-bold uppercase tracking-widest text-black transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                Empezar Experiencia
              </Link>
              <Link href="/login" className="flex h-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] px-12 text-sm font-bold uppercase tracking-widest text-zinc-400 transition-all hover:bg-white/[0.05] hover:text-white">
                Acceso Privado
              </Link>
            </div>
          </section>

          {/* Floating UI Elements (The "App" look) */}
          <div className="relative hidden w-full max-w-md lg:block">
            <div className="absolute -inset-20 bg-indigo-500/10 blur-[100px] rounded-full" />
            
            {/* Main Preview Card */}
            <div className="relative rounded-[48px] border border-white/10 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-3xl transition-transform duration-1000 hover:rotate-1 hover:scale-[1.02]">
              <div className="relative aspect-[1.5/1] w-full overflow-hidden rounded-[32px] bg-black/40 border border-white/5 p-6 mb-8">
                <Image src="/march.png" alt="Fiate Preview" fill priority className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight">Fiat Uno Way</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">Status: En Ruta</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-indigo-500">95%</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">Health Score</p>
                  </div>
                </div>
                
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-indigo-500 to-teal-400" />
                </div>
              </div>
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -bottom-10 -left-16 rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-2xl backdrop-blur-xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Seguro</p>
                  <p className="text-sm font-bold">Vigente hasta 2027</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid (Non-Symmetrical) */}
      <div className="relative z-10 bg-white py-40 text-black">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-600">Ingeniería de Software</h2>
              <h3 className="text-5xl font-medium tracking-tighter sm:text-7xl">
                Diseñado para <br />
                quienes exigen <br />
                perfección.
              </h3>
              <p className="max-w-md text-lg text-zinc-500">
                Fiate no solo registra datos, los transforma en conocimiento accionable para proteger tu inversión más preciada.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { title: "Métricas en Vivo", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
                { title: "Gestión de Flota", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
                { title: "Seguridad AI", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> },
                { title: "Control Total", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> },
              ].map((item, idx) => (
                <div key={idx} className="group rounded-[32px] border border-zinc-100 bg-zinc-50 p-8 transition-all hover:bg-zinc-100 hover:border-zinc-200">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA (The Invitation) */}
      <div className="relative py-48 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
        <div className="relative z-10 text-center space-y-12 max-w-4xl px-6">
          <h2 className="text-5xl font-medium tracking-tighter sm:text-8xl">
            La carretera <br /> te está esperando.
          </h2>
          <Link href="/register" className="inline-flex h-20 items-center justify-center rounded-full bg-indigo-600 px-16 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(79,70,229,0.3)]">
            Obtener Acceso Inmediato
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Únete a la nueva era del mantenimiento automotriz</p>
        </div>
      </div>
    </div>
  );
}
