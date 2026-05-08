"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { resetPasswordAction } from "../actions/resetPassword";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden.");
    }

    setIsPending(true);
    try {
      // 1. Obtener el usuario de la sesión de recuperación
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.email) {
        return toast.error("La sesión de recuperación ha expirado. Solicita un nuevo correo.");
      }

      // 2. Actualizar en Prisma (Fuente de verdad para el Login)
      const prismaResult = await resetPasswordAction(user.email, password);
      
      if (prismaResult.error) {
        return toast.error(prismaResult.error);
      }

      // 3. Actualizar en Supabase Auth (Para consistencia)
      const { error: authError } = await supabase.auth.updateUser({ password });
      
      if (authError) {
        toast.error("Error en Supabase: " + authError.message);
      } else {
        toast.success("Contraseña actualizada con éxito en todo el sistema.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 p-6 selection:bg-indigo-500/30">
      <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 w-full max-w-md space-y-12 rounded-[40px] border border-white/5 bg-zinc-900/40 p-10 backdrop-blur-2xl shadow-2xl">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-white uppercase">Nueva Contraseña</h3>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em]">Crea una clave segura para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="block h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-700"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="block h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-indigo-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {isPending ? "Guardando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
