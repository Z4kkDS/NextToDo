"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Cloud, Loader2, Monitor, Zap } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Demo local — CTA principal */}
      <div className="space-y-2">
        <Button
          className="w-full h-11 font-semibold gap-2 cursor-pointer"
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
          <Monitor className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sin registro. Los datos se guardan localmente en este dispositivo.
          </p>
        </div>
      </div>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-[11px] text-muted-foreground uppercase tracking-wide">
          o
        </span>
      </div>

      {/* Google — opción secundaria */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full h-11 gap-2 cursor-pointer"
          onClick={signInWithGoogle}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
          )}
          {loading ? "Iniciando sesión..." : "Continuar con Google"}
        </Button>
        <div className="flex items-start gap-2 px-1">
          <Cloud className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sincroniza tus tareas en todos tus dispositivos.
          </p>
        </div>
      </div>
    </div>
  );
}
