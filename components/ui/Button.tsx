import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 " +
  "font-sans text-base font-semibold transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  // The lime-green CTA pill — Sprout's single primary action color.
  primary: "bg-primary text-on-primary hover:bg-primary-active",
  secondary: "bg-canvas-soft text-ink hover:bg-primary-pale",
  tertiary: "bg-canvas text-ink border border-ink hover:bg-canvas-soft",
  danger: "bg-negative text-canvas hover:bg-negative-deep",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
