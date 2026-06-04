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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinance } from "@/context/FinanceContext";
import { formatCLP } from "@/lib/finance-utils";
import { IncomeType } from "@/types/finance";
import { Banknote, Gift, Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function IncomeSection() {
  const { budget, addIncome, deleteIncome } = useFinance();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<IncomeType>("sueldo");

  if (!budget) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!label.trim() || !value || value <= 0) {
      toast.error("Ingresa una descripción y un monto válido");
      return;
    }
    addIncome({
      label: label.trim(),
      amount: value,
      type,
      date: new Date().toISOString().slice(0, 10),
    });
    toast.success("Ingreso agregado");
    setLabel("");
    setAmount("");
    setType("sueldo");
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-emerald-500" />
          Ingresos
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
              <DialogTitle>Agregar ingreso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="income-label">Descripción</Label>
                <Input
                  id="income-label"
                  placeholder="Ej: Sueldo, Aguinaldo, Bono"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Monto (CLP)</Label>
                  <Input
                    id="income-amount"
                    type="number"
                    inputMode="numeric"
                    placeholder="500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={(v) => setType(v as IncomeType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sueldo">Sueldo</SelectItem>
                      <SelectItem value="extra">Extra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="cursor-pointer">
                  Agregar ingreso
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-2">
        {budget.incomes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aún no has registrado ingresos este mes.
          </p>
        ) : (
          budget.incomes.map((income) => (
            <div
              key={income.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
                  {income.type === "extra" ? (
                    <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{income.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(income.date).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatCLP(income.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  onClick={() => {
                    deleteIncome(income.id);
                    toast.success("Ingreso eliminado");
                  }}
                  aria-label="Eliminar ingreso"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
