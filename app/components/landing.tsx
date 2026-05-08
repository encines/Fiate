"use client";

import Image from "next/image";
import Link from "next/link";
import { Icons } from "./Icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const FEATURES = [
  { title: "Métricas en Vivo", Icon: Icons.Metrics },
  { title: "Gestión de Flota", Icon: Icons.Fleet },
  { title: "Seguridad AI", Icon: Icons.Security },
  { title: "Control Total", Icon: Icons.Control },
];

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white selection:bg-indigo-500/30 font-sans transition-colors duration-500">
      {/* Texture Layer: Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
           style={{ 
             backgroundImage: mounted ? `linear-gradient(to right, ${theme === 'dark' ? '#808080' : '#d1d1d1'} 1px, transparent 1px), linear-gradient(to bottom, ${theme === 'dark' ? '#808080' : '#d1d1d1'} 1px, transparent 1px)` : 'none', 
             backgroundSize: '40px 40px' 
           }} />

      {/* Hero Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-48 lg:px-12 lg:pt-48">
        <div className="flex flex-col items-center gap-24 lg:flex-row lg:items-start lg:justify-between">
          <section className="max-w-3xl space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-white/[0.03] px-4 py-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">Plataforma de Gestión Automotriz 2026</span>
            </div>
            
            <div className="space-y-8">
              <h1 className="text-6xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-8xl lg:text-[100px]">
                El arte de <br />
                <span className="bg-gradient-to-r from-indigo-500 via-zinc-900 to-teal-500 dark:from-indigo-400 dark:via-white dark:to-teal-400 bg-clip-text text-transparent">cuidar tu motor.</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-zinc-500 lg:mx-0 lg:text-xl">
                Fiate redefine la relación con tu vehículo. Una suite de herramientas de precisión para quienes ven en su auto más que un medio de transporte.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row lg:justify-start">
              <Link href="/register" className="relative flex h-16 items-center justify-center rounded-full bg-zinc-900 dark:bg-white px-12 text-sm font-bold uppercase tracking-widest text-white dark:text-black transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                Empezar Experiencia
              </Link>
              <Link href="/login" className="flex h-16 items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 bg-white/[0.02] px-12 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-white">
                Acceso Privado
              </Link>
            </div>
          </section>

          {/* Floating UI Elements */}
          <div className="relative hidden w-full max-w-md lg:block">
            <div className="relative rounded-[48px] border border-zinc-200/60 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl transition-transform duration-1000 hover:rotate-1 hover:scale-[1.02]">
              <div className="relative aspect-[1.5/1] w-full overflow-hidden rounded-[32px] bg-zinc-100/50 dark:bg-black/40 border border-zinc-200/50 dark:border-white/5 p-6 mb-8">
                <Image 
                  src="/march.png" 
                  alt="Fiate Preview" 
                  fill 
                  priority 
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-contain" 
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Fiat Uno Way</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">Status: En Ruta</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-indigo-600 dark:text-indigo-500">95%</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Health Score</p>
                  </div>
                </div>
                
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-indigo-500 to-teal-400" />
                </div>
              </div>
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -bottom-10 -left-16 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/95 p-6 shadow-2xl animate-bounce-slow will-change-transform backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400">
                  <Icons.Shield />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Seguro</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Vigente hasta 2027</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 bg-zinc-50 dark:bg-white py-40 text-zinc-900 dark:text-black transition-colors">
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
              {FEATURES.map((item, idx) => (
                <div key={idx} className="group rounded-[32px] border border-zinc-200 dark:border-zinc-100 bg-white dark:bg-zinc-50 p-8 transition-all hover:bg-zinc-100 hover:border-zinc-300 dark:hover:bg-zinc-100 dark:hover:border-zinc-200 shadow-sm hover:shadow-md">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-white shadow-sm transition-transform group-hover:scale-110 border border-zinc-100">
                    <item.Icon />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-800">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-48 bg-white dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden transition-colors">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="relative z-10 text-center space-y-12 max-w-4xl px-6">
          <h2 className="text-5xl font-medium tracking-tighter sm:text-8xl text-zinc-900 dark:text-white">
            La carretera <br /> te está esperando.
          </h2>
          <Link href="/register" className="inline-flex h-20 items-center justify-center rounded-full bg-indigo-600 px-16 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 hover:shadow-[0_0_60px_rgba(79,70,229,0.3)]">
            Obtener Acceso Inmediato
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600 dark:text-zinc-600">Únete a la nueva era del mantenimiento automotriz</p>
        </div>
      </div>
    </div>
  );
}
