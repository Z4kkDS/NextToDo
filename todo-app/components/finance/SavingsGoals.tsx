"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SectionLabel } from "@/components/ui/section-label";
import { useFinance } from "@/context/FinanceContext";
import { formatCLP } from "@/lib/finance-utils";
import { Check, Minus, PiggyBank, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SavingsGoals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(target);
    if (!name.trim() || !value || value <= 0) {
      toast.error("Ingresa un nombre y una meta válida");
      return;
    }
    addGoal(name.trim(), value);
    toast.success("Meta creada");
    setName("");
    setTarget("");
    setOpen(false);
  };

  // Ajusta el ahorro acumulado de una meta en un delta (clamp 0..target).
  const adjust = (id: string, current: number, target: number, delta: number) => {
    const next = Math.max(0, Math.min(target, current + delta));
    updateGoal(id, { saved: next });
  };

  return (
    <BentoCard className="rise h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <SectionLabel icon={PiggyBank} accent="var(--amber)" className="mb-0">
          METAS DE AHORRO
        </SectionLabel>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 h-7 px-2 text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva meta de ahorro</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Nombre</Label>
                <Input
                  id="goal-name"
                  placeholder="Ej: Vacaciones, Fondo de emergencia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Meta (CLP)</Label>
                <Input
                  id="goal-target"
                  type="number"
                  inputMode="numeric"
                  placeholder="1000000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  Crear meta
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-[13px]">
        {goals.length === 0 ? (
          <p className="text-[13px] text-ink-3 text-center py-4">
            Crea una meta para empezar a ahorrar con un objetivo claro.
          </p>
        ) : (
          goals.map((goal) => {
            const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
            const done = goal.saved >= goal.target;
            return (
              <div key={goal.id}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-[30px] h-[30px] rounded-[9px] grid place-items-center bg-xp-soft border border-xp shrink-0">
                    {done ? (
                      <Check className="h-4 w-4 text-pos" strokeWidth={2.5} />
                    ) : (
                      <Target className="h-4 w-4 text-brand-deep dark:text-brand" strokeWidth={1.8} />
                    )}
                  </div>
                  <span className="text-[13px] font-semibold text-ink flex-1 truncate">
                    {goal.name}
                  </span>
                  <span className="font-num text-[12.5px] text-xp">{pct}%</span>
                  <button
                    type="button"
                    onClick={() => {
                      deleteGoal(goal.id);
                      toast.success("Meta eliminada");
                    }}
                    aria-label="Eliminar meta"
                    className="grid place-items-center h-6 w-6 rounded-md text-ink-3 hover:bg-destructive/10 hover:text-neg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Progress value={pct} className="h-[7px] bg-surface-3 [&>div]:bg-xp" />
                <div className="flex items-center justify-between mt-[5px]">
                  <span className="font-num text-xs text-ink-3">
                    {formatCLP(goal.saved)} de {formatCLP(goal.target)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-md cursor-pointer"
                      onClick={() => adjust(goal.id, goal.saved, goal.target, -10000)}
                      aria-label="Restar 10.000"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-md cursor-pointer"
                      onClick={() => adjust(goal.id, goal.saved, goal.target, 10000)}
                      aria-label="Sumar 10.000"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </BentoCard>
  );
}
