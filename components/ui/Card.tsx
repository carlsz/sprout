import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** White card on the sage canvas — surface contrast is the elevation (DESIGN). */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl bg-canvas p-6", className)} {...props} />
  );
}
