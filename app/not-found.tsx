"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 font-sans selection:bg-orange-500/30">
      {/* Texture Layer: Grid */}
      <div className="absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-600/10 blur-[120px]" />

      <div className="relative z-10 flex flex-col items-center space-y-12 px-6 text-center">
        <div className="space-y-4">
          <Link href="/" className="flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95">
            <Image src="/screen.png" alt="Fiate" width={60} height={60} className="h-10 w-auto object-contain brightness-110" />
            <span className="text-xl font-black uppercase tracking-tighter text-white">Fiate</span>
          </Link>
          <div className="h-[1px] w-12 mx-auto bg-orange-500/50" />
        </div>

        <div className="space-y-6">
          <div aria-hidden="true" className="text-[120px] font-black leading-none tracking-tighter text-white/5 select-none sm:text-[180px]">
            404
          </div>
          <div className="-mt-16 sm:-mt-24 space-y-4">
            <h1 className="text-3xl font-medium tracking-tight text-white sm:text-5xl">
              Ruta no <span className="text-orange-500 font-black italic">encontrada.</span>
            </h1>
            <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-zinc-500 sm:text-base">
              Parece que has tomado un desvío inexistente. Regresemos al garaje principal para retomar el camino.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="group relative flex h-16 items-center justify-center overflow-hidden rounded-full bg-white px-12 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-zinc-200 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
