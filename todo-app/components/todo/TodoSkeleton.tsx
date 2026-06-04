"use client";

import { Skeleton } from "@/components/ui/skeleton";

function TodoItemSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl border bg-card mb-2">
      {/* barra de prioridad */}
      <div className="w-1 shrink-0 bg-muted rounded-l-xl" />
      <div className="flex-1 p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-4 w-4 rounded mt-1 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TodoListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: count }).map((_, i) => (
        <TodoItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progreso */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
      {/* Stats */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <Skeleton className="h-5 w-28" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
