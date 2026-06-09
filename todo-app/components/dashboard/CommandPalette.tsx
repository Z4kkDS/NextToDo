"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTodo } from "@/context/TodoContext";
import { TodoFilter } from "@/types";
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  LayoutList,
  ListTodo,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Search,
  Sun,
  Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CommandPaletteProps {
  onNewTask: () => void;
  onTab: (tab: "tasks" | "finance") => void;
}

export function CommandPalette({ onNewTask, onTab }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const { setFilter } = useTodo();
  const { setTheme } = useTheme();
  const { logout } = useAuth();
  const { startTour } = useOnboarding();

  // Atajo global ⌘K / Ctrl+K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    // Pequeño defer para que el diálogo cierre antes de abrir otro.
    setTimeout(action, 0);
  };

  const goFilter = (filter: TodoFilter) => {
    setFilter(filter);
    onTab("tasks");
  };

  return (
    <>
      {/* Disparador compacto: lupa + ⌘K */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Comandos (⌘K)"
        aria-label="Abrir paleta de comandos"
        className="inline-flex items-center gap-2 rounded-xl border bg-surface px-3 h-[42px] text-ink-2 hover:bg-surface-2 transition-colors cursor-pointer elev-1 shrink-0"
      >
        <Search className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
        <span className="hidden sm:inline text-xs font-semibold text-ink-3">⌘K</span>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Escribe un comando o busca…" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          <CommandGroup heading="Acciones">
            <CommandItem onSelect={() => run(onNewTask)}>
              <Plus />
              Nueva tarea
              <CommandShortcut>Crear</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(startTour)}>
              <HelpCircle />
              Ver tutorial
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navegación">
            <CommandItem onSelect={() => run(() => onTab("tasks"))}>
              <ListTodo />
              Ir a Tareas
            </CommandItem>
            <CommandItem onSelect={() => run(() => onTab("finance"))}>
              <Wallet />
              Ir a Finanzas
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Filtrar tareas">
            <CommandItem onSelect={() => run(() => goFilter("all"))}>
              <LayoutList />
              Todas las tareas
            </CommandItem>
            <CommandItem onSelect={() => run(() => goFilter("active"))}>
              <Clock />
              Pendientes
            </CommandItem>
            <CommandItem onSelect={() => run(() => goFilter("completed"))}>
              <CheckCircle2 />
              Completadas
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tema">
            <CommandItem onSelect={() => run(() => setTheme("light"))}>
              <Sun />
              Claro
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("dark"))}>
              <Moon />
              Oscuro
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("system"))}>
              <Monitor />
              Sistema
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Cuenta">
            <CommandItem onSelect={() => run(logout)} className="text-destructive">
              <LogOut />
              Cerrar sesión
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
