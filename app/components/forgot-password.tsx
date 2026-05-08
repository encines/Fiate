"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSent(true);
        toast.success("Si el correo existe, hemos enviado instrucciones.");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-zinc-950 font-sans selection:bg-rose-500/30">
      {/* Visual Side */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
             style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px]" />
        
        <Link href="/" className="relative z-10 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <Image src="/screen.png" alt="Fiate" width={60} height={60} className="h-10 w-auto object-contain brightness-110" />
          <span className="text-xl font-black uppercase tracking-tighter text-white">Fiate</span>
        </Link>

        <div className="relative z-10 space-y-6">
          <h2 className="text-6xl font-medium tracking-tighter text-white leading-tight">
            No te preocupes, <br /> <span className="text-rose-500">te respaldamos.</span>
          </h2>
          <p className="max-w-md text-lg text-zinc-500">
            Recuperar el acceso a tu garaje digital es rápido y seguro. Sigue los pasos y vuelve a la carretera.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="h-1 w-12 rounded-full bg-rose-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Account Recovery Protocol</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-sm space-y-12">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-4xl font-black tracking-tight text-white uppercase">Recuperar Cuenta</h3>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
              {isSent ? "Revisa tu bandeja de entrada" : "Ingresa tu correo registrado"}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-rose-400 transition-colors">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className="block h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all focus:border-rose-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-rose-500/10 placeholder:text-zinc-700"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-rose-600 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-rose-500 hover:shadow-[0_20px_40px_rgba(225,29,72,0.3)] disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {isPending ? "Enviando..." : "Enviar Instrucciones"}
              </button>
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="rounded-[32px] border border-white/5 bg-white/[0.03] p-8 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Si hay una cuenta asociada a <span className="text-white font-bold">{email}</span>, recibirás un enlace para restablecer tu contraseña en unos minutos.
                </p>
              </div>
              <button
                onClick={() => setIsSent(false)}
                className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                ¿No recibiste nada? Reintentar
              </button>
            </div>
          )}

          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
            ¿Recordaste tu clave?{" "}
            <Link href="/login" className="text-white hover:text-rose-400 transition-colors">
              Volver al acceso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
