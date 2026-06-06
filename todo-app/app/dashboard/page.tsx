"use client";

import { UserHeader } from "@/components/auth/UserHeader";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { TasksView } from "@/components/dashboard/TasksView";
import { FinancePanel } from "@/components/finance/FinancePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import type { User } from "firebase/auth";
import { ListChecks, Loader2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getDynamicGreeting(name: string): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: `Buenos días, ${name}`, emoji: "☀️" };
  if (hour >= 12 && hour < 19) return { greeting: `Buenas tardes, ${name}`, emoji: "🌤️" };
  return { greeting: `Buenas noches, ${name}`, emoji: "🌙" };
}

function formatDate(): string {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"tasks" | "finance">("tasks");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) router.push("/login");
  }, [user, authLoading, router]);

  const handleNewTask = () => {
    setTab("tasks");
    setCreateOpen(true);
  };

  const firstName = useMemo(
    () => (user as User)?.displayName?.split(" ")[0] || "Usuario",
    [user]
  );
  const { greeting, emoji } = useMemo(() => getDynamicGreeting(firstName), [firstName]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dashboard-bg">
      <UserHeader />

      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        {/* Saludo dinámico + paleta de comandos */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2">
              {greeting}
              <span aria-hidden="true">{emoji}</span>
            </h2>
            <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
          </div>
          <CommandPalette onNewTask={handleNewTask} onTab={setTab} />
        </div>

        {/* Pestañas: Tareas | Finanzas */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as "tasks" | "finance")} className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks" className="gap-1.5 cursor-pointer">
              <ListChecks className="h-4 w-4" />
              Tareas
            </TabsTrigger>
            <TabsTrigger value="finance" className="gap-1.5 cursor-pointer">
              <Wallet className="h-4 w-4" />
              Finanzas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <TasksView createOpen={createOpen} onCreateOpenChange={setCreateOpen} />
          </TabsContent>

          <TabsContent value="finance">
            <FinancePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
