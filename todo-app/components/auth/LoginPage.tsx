"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Chrome } from "lucide-react";

export function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido a TodoApp</CardTitle>
          <CardDescription>Inicia sesión para acceder a tus tareas personalizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} disabled={loading} className="w-full" size="lg">
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? "Iniciando sesión..." : "Continuar con Google"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
