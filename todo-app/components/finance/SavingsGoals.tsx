"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useFinance } from "@/context/FinanceContext";
import { formatCLP } from "@/lib/finance-utils";
import { Minus, Plus, Target, Trash2 } from "lucide-react";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Metas de ahorro
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 cursor-pointer">
              <Plus className="h-4 w-4" />
              Nueva meta
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
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Crea una meta para empezar a ahorrar con un objetivo claro.
          </p>
        ) : (
          goals.map((goal) => {
            const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
            const done = goal.saved >= goal.target;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {goal.name}
                    {done && <span className="text-emerald-500">✓</span>}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => {
                      deleteGoal(goal.id);
                      toast.success("Meta eliminada");
                    }}
                    aria-label="Eliminar meta"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatCLP(goal.saved)} de {formatCLP(goal.target)} · {pct}%
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 cursor-pointer"
                      onClick={() => adjust(goal.id, goal.saved, goal.target, -10000)}
                      aria-label="Restar 10.000"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 cursor-pointer"
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
      </CardContent>
    </Card>
  );
}
