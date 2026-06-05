"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPENSE_CATEGORIES, formatCLP } from "@/lib/finance-utils";
import { ExpenseCategory } from "@/types/finance";

interface TaskCostFieldsProps {
  amount: number | undefined;
  onAmountChange: (amount: number | undefined) => void;
  category: ExpenseCategory;
  onCategoryChange: (category: ExpenseCategory) => void;
  idPrefix?: string;
}

export function TaskCostFields({
  amount,
  onAmountChange,
  category,
  onCategoryChange,
  idPrefix = "task",
}: TaskCostFieldsProps) {
  const handleAmount = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    onAmountChange(digits ? parseInt(digits, 10) : undefined);
  };

  const hasAmount = typeof amount === "number" && amount > 0;

  return (
    <div className="space-y-3 rounded-lg border border-dashed p-3">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-amount`}>Monto (opcional)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
            $
          </span>
          <Input
            id={`${idPrefix}-amount`}
            inputMode="numeric"
            placeholder="0"
            value={amount ? amount.toLocaleString("es-CL") : ""}
            onChange={(e) => handleAmount(e.target.value)}
            className="pl-7 tabular-nums"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {hasAmount
            ? `Esta tarea contará como gasto de ${formatCLP(amount!)} en Finanzas.`
            : "Si añades un monto, la tarea aparecerá como gasto en el Panel de Finanzas."}
        </p>
      </div>

      {hasAmount && (
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-category`}>Categoría del gasto</Label>
          <Select value={category} onValueChange={(v) => onCategoryChange(v as ExpenseCategory)}>
            <SelectTrigger id={`${idPrefix}-category`} className="cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value} className="cursor-pointer">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
