"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Loader2, Zap } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Demo local — opción principal */}
      <Button
        className="w-full h-12 text-base font-semibold gap-2"
        onClick={signInAsGuest}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        {loading ? "Iniciando..." : "Pruébalo sin registrarte"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Sin cuenta ni contraseña — empieza en segundos. Datos solo en este dispositivo.
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">o</span>
        </div>
      </div>

      {/* Google — opción secundaria */}
      <Button
        variant="outline"
        className="w-full h-11 gap-2"
        onClick={signInWithGoogle}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
        )}
        {loading ? "Iniciando sesión..." : "Continuar con Google"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Con Google tus tareas se sincronizan en todos tus dispositivos.
      </p>
    </div>
  );
}
