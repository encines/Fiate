"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "../actions/auth";

export default function Login() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30">
      {/* Visual Side (Hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
             style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <Image src="/screen.png" alt="Fiate" width={60} height={60} className="h-10 w-auto object-contain brightness-110" />
          <span className="text-xl font-black uppercase tracking-tighter text-white">Fiate</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-medium tracking-tighter text-white leading-tight">
            Bienvenido al <br /> <span className="text-indigo-500">futuro de tu garaje.</span>
          </h2>
          <p className="max-w-md text-lg text-zinc-500">
            Gestiona tu flota con precisión quirúrgica y la potencia de la inteligencia artificial.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="h-1 w-12 rounded-full bg-indigo-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Engineering Excellence</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-sm space-y-12">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-4xl font-black tracking-tight text-white uppercase">Acceso Privado</h3>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Ingresa tus credenciales para continuar</p>
          </div>

          <form action={formAction} className="space-y-8">
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  defaultValue="carlos@example.com"
                  placeholder="name@domain.com"
                  className="block h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-700"
                />
              </div>

              <div className="group space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                    Contraseña
                  </label>
                  <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-400">
                    ¿Olvidaste la clave?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  defaultValue="123456"
                  placeholder="••••••••"
                  className="block h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-700"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-500 uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {isPending ? "Validando..." : "Ingresar a Fiate"}
            </button>
          </form>

          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
            ¿Nuevo en el club?{" "}
            <Link href="/register" className="text-white hover:text-indigo-400 transition-colors">
              Crea tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
