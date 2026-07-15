import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/cn";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

/** Canonical text input — ink hairline border, 12px radius (DESIGN-wise text-input). */
export function TextInput({ className, ref, ...props }: TextInputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-ink bg-canvas px-4 py-3",
        "font-sans text-base text-ink placeholder:text-mute",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      {...props}
    />
  );
}
