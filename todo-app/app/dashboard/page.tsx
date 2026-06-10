"use client";

import { UserHeader } from "@/components/auth/UserHeader";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { TasksView } from "@/components/dashboard/TasksView";
import { FinancePanel } from "@/components/finance/FinancePanel";
import { StreakChip } from "@/components/gamification/StreakChip";
import { XPBar } from "@/components/gamification/XPBar";
import { XPToast } from "@/components/gamification/XPToast";
import { MascotasPanel } from "@/components/mascotas/MascotasPanel";
import { PetWidget } from "@/components/mascotas/PetWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import type { User } from "firebase/auth";
import { ListChecks, Loader2, PawPrint, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Buenos días,";
  if (hour >= 12 && hour < 19) return "Buenas tardes,";
  return "Buenas noches,";
}

type DashboardTab = "tasks" | "finance" | "mascotas";

const TAB_TRIGGER_CLASS =
  "gap-2 px-4 py-2 rounded-[10px] font-semibold text-[15px] cursor-pointer text-ink-2 " +
  "data-[state=active]:bg-brand data-[state=active]:text-primary-foreground " +
  "data-[state=active]:shadow-[0_4px_12px_-4px_rgba(234,99,6,.4)] dark:data-[state=active]:border-transparent";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("tasks");
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
  const greeting = useMemo(getGreeting, []);

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
      <XPToast />

      <div className="container mx-auto max-w-[1180px] px-4 py-6 lg:py-7 space-y-5">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as DashboardTab)}
          className="space-y-5"
        >
          {/* TopBar gamificada: saludo + tabs + XP/racha/⌘K */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {/* Saludo + marca */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="font-display grid place-items-center w-[42px] h-[42px] bg-brand text-primary-foreground rounded-xl text-[22px] border border-brand-deep elev-primary">
                N
              </div>
              <div>
                <div className="text-xs text-ink-3 font-semibold">{greeting}</div>
                <div className="font-display text-xl text-ink leading-tight">
                  ¡{firstName}!
                </div>
              </div>
            </div>

            {/* Tabs centradas (desktop) */}
            <TabsList className="order-last w-full lg:order-none lg:w-auto lg:mx-auto h-auto p-[5px] gap-1.5 bg-surface-2 border rounded-[14px]">
              <TabsTrigger value="tasks" className={TAB_TRIGGER_CLASS}>
                <ListChecks className="h-4 w-4" />
                Tareas
              </TabsTrigger>
              <TabsTrigger value="finance" className={TAB_TRIGGER_CLASS}>
                <Wallet className="h-4 w-4" />
                Finanzas
              </TabsTrigger>
              <TabsTrigger value="mascotas" className={TAB_TRIGGER_CLASS}>
                <PawPrint className="h-4 w-4" />
                Mascotas
              </TabsTrigger>
            </TabsList>

            {/* Cluster de gamificación — fila propia en móvil para no pisar el saludo */}
            <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto sm:flex-1 lg:flex-none justify-end min-w-0">
              <PetWidget onOpen={() => setTab("mascotas")} />
              <XPBar className="flex-1 lg:flex-none lg:min-w-[200px] max-w-none sm:max-w-[260px]" />
              <StreakChip className="shrink-0" />
              <CommandPalette onNewTask={handleNewTask} onTab={setTab} />
            </div>
          </div>

          <TabsContent value="tasks">
            <TasksView
              createOpen={createOpen}
              onCreateOpenChange={setCreateOpen}
              onOpenStore={() => setTab("mascotas")}
            />
          </TabsContent>

          <TabsContent value="finance">
            <FinancePanel />
          </TabsContent>

          <TabsContent value="mascotas">
            <MascotasPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
