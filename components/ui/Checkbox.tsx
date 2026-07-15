import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Native checkbox tinted with Sprout green. Kept native for full keyboard + a11y support. */
export function Checkbox({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-5 shrink-0 cursor-pointer rounded-sm accent-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
        className,
      )}
      {...props}
    />
  );
}
