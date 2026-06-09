import { cn } from "@/lib/utils";

interface BentoCardProps extends React.ComponentProps<"div"> {
  /** "tint" usa la superficie cálida secundaria en lugar del blanco. */
  tone?: "default" | "tint";
}

/** Tarjeta del bento — superficie, borde 1px, radio 16px y elevación suave. */
export function BentoCard({ className, tone = "default", ...props }: BentoCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border text-card-foreground elev-1 p-[18px]",
        tone === "tint" ? "bg-surface-2" : "bg-card",
        className
      )}
      {...props}
    />
  );
}
