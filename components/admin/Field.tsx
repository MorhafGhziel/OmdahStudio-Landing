"use client";

import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const controlStyles =
  "w-full rounded-sm border border-hairline bg-ink-2 px-3 py-2.5 text-chalk outline-none transition-colors placeholder:text-smoke focus:border-clay focus:bg-ink-3";

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: (props: { id: string; className: string }) => ReactNode;
}

/** Label + control + hint, so admin forms stop re-inventing their own markup. */
export function Field({ label, hint, required, children }: FieldProps) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="t-label-ar block text-smoke">
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>
      {children({ id, className: controlStyles })}
      {hint && <p className="t-meta text-smoke">{hint}</p>}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <Button
      {...props}
      variant={
        variant === "danger" ? "accent" : variant === "ghost" ? "outline" : "solid"
      }
      className={cn("t-label-ar", className)}
    >
      {children}
    </Button>
  );
}
