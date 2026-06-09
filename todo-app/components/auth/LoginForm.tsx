"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Cloud, Loader2, Monitor, Zap } from "lucide-react";

/* Logo de Google oficial a 4 colores */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Demo local — CTA principal */}
      <div className="space-y-2">
        <Button
          className="w-full h-12 text-[15px] font-semibold gap-2 cursor-pointer rounded-xl elev-primary"
          onClick={signInAsGuest}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          {loading ? "Iniciando..." : "Empezar sin cuenta"}
        </Button>
        <div className="flex items-start gap-2 px-1">
          <Monitor className="h-3.5 w-3.5 text-ink-3 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-3 leading-relaxed">
            Sin registro. Los datos se guardan localmente en este dispositivo.
          </p>
        </div>
      </div>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[11px] text-ink-3 font-semibold uppercase tracking-wide">
          o
        </span>
      </div>

      {/* Google — opción secundaria */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full h-[46px] text-sm font-semibold gap-2 cursor-pointer rounded-xl elev-1"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <GoogleMark className="h-5 w-5 shrink-0" />
          )}
          {loading ? "Iniciando sesión..." : "Continuar con Google"}
        </Button>
        <div className="flex items-start gap-2 px-1">
          <Cloud className="h-3.5 w-3.5 text-ink-3 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-3 leading-relaxed">
            Sincroniza tus tareas en todos tus dispositivos.
          </p>
        </div>
      </div>
    </div>
  );
}
