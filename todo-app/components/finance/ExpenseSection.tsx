"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { CATEGORY_META, EXPENSE_CATEGORIES, formatCLP, totalPlanned, totalSpent } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";
import { ExpenseCategory } from "@/types/finance";
import { Receipt, Plus, Repeat, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ExpenseSection() {
  const { budget, addExpense, updateExpense, deleteExpense } = useFinance();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("cuentas");
  const [planned, setPlanned] = useState("");
  const [recurring, setRecurring] = useState(false);

  if (!budget) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(planned);
    if (!name.trim() || !value || value <= 0) {
      toast.error("Ingresa un nombre y un monto presupuestado válido");
      return;
    }
    addExpense({ name: name.trim(), category, planned: value, spent: 0, recurring });
    toast.success("Gasto agregado");
    setName("");
    setCategory("cuentas");
    setPlanned("");
    setRecurring(false);
    setOpen(false);
  };

  const planned_ = totalPlanned(budget.expenses);
  const spent_ = totalSpent(budget.expenses);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5 text-primary" />
          Gastos
          {budget.expenses.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              {formatCLP(spent_)} / {formatCLP(planned_)}
            </span>
          )}
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1 cursor-pointer">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar gasto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="exp-name">Nombre</Label>
                <Input
                  id="exp-name"
                  placeholder="Ej: Arriendo, Netflix, Tarjeta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-planned">Presupuesto (CLP)</Label>
                  <Input
                    id="exp-planned"
                    type="number"
                    inputMode="numeric"
                    placeholder="150000"
                    value={planned}
                    onChange={(e) => setPlanned(e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={recurring}
                  onCheckedChange={(v) => setRecurring(v === true)}
                />
                <span className="text-sm flex items-center gap-1">
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
                  Gasto recurrente (se copia al mes siguiente)
                </span>
              </label>
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  Agregar gasto
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {budget.expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aún no has registrado gastos este mes.
          </p>
        ) : (
          budget.expenses.map((expense) => {
            const meta = CATEGORY_META[expense.category];
            const pct = expense.planned > 0
              ? Math.min(Math.round((expense.spent / expense.planned) * 100), 100)
              : 0;
            const over = expense.spent > expense.planned;

            return (
              <div key={expense.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", meta.color)} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate flex items-center gap-1.5">
                        {expense.name}
                        {expense.recurring && (
                          <Repeat className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{meta.label}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                    onClick={() => {
                      deleteExpense(expense.id);
                      toast.success("Gasto eliminado");
                    }}
                    aria-label="Eliminar gasto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <Progress value={pct} className="h-1.5" />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor={`spent-${expense.id}`} className="text-xs text-muted-foreground">
                      Gastado:
                    </Label>
                    <Input
                      id={`spent-${expense.id}`}
                      type="number"
                      inputMode="numeric"
                      defaultValue={expense.spent || ""}
                      placeholder="0"
                      className="h-7 w-28 text-sm"
                      onBlur={(e) => {
                        const v = Math.max(0, Number(e.target.value) || 0);
                        if (v !== expense.spent) updateExpense(expense.id, { spent: v });
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      over ? "text-rose-600 dark:text-rose-400 font-medium" : "text-muted-foreground"
                    )}
                  >
                    {over ? "Sobregiro · " : ""}
                    de {formatCLP(expense.planned)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
