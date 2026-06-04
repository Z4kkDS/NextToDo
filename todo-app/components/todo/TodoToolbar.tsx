"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTodo } from "@/context/TodoContext";
import { getTagColor } from "@/lib/todo-utils";
import { cn } from "@/lib/utils";
import { TodoSort } from "@/types";
import { ArrowUpDown, Search, Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SORT_LABELS: Record<TodoSort, string> = {
  created: "Más recientes",
  dueDate: "Fecha de vencimiento",
  priority: "Prioridad",
  alphabetical: "Alfabético (A-Z)",
};

export function TodoToolbar() {
  const { searchQuery, setSearchQuery, sort, setSort, tagFilter, setTagFilter } = useTodo();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce de la búsqueda (250ms) para no filtrar en cada pulsación.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(localSearch), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, setSearchQuery]);

  // Sincronizar si se limpia desde fuera.
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar tareas..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-8"
            aria-label="Buscar tareas"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Ordenamiento */}
        <Select value={sort} onValueChange={(v) => setSort(v as TodoSort)}>
          <SelectTrigger className="w-full sm:w-[200px] cursor-pointer" aria-label="Ordenar tareas">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as TodoSort[]).map((key) => (
              <SelectItem key={key} value={key} className="cursor-pointer">
                {SORT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chip de etiqueta activa */}
      {tagFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filtrando por:</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
              getTagColor(tagFilter)
            )}
          >
            <Tag className="h-3 w-3" />
            {tagFilter}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTagFilter(null)}
            className="h-6 px-2 text-xs cursor-pointer"
          >
            <X className="h-3 w-3 mr-1" />
            Quitar
          </Button>
        </div>
      )}
    </div>
  );
}
