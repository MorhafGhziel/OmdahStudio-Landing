"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

/**
 * The button.
 *
 * The hover is a fill that wipes across from the reading edge, on the same
 * 600ms cubic-bezier the contact CTA already uses — so a press anywhere on
 * the site is recognisably the same gesture. What it replaced was a flat
 * background swap with a scale-down on press: the default shape of a button
 * on any generated page, and the reason these read as templated.
 *
 * The wipe runs `origin-right`, which is the start edge under this site's
 * RTL direction. In an LTR context it would sweep from the wrong side.
 */
const VARIANTS: Record<
  Variant,
  { face: string; sweep: string; label: string }
> = {
  solid: {
    face: "bg-chalk text-ink",
    sweep: "bg-clay",
    label: "",
  },
  outline: {
    face: "border border-hairline text-chalk",
    sweep: "bg-chalk",
    // Flips once the wipe has actually covered the text, not before it.
    label: "transition-colors duration-200 delay-200 group-hover:text-ink",
  },
  ghost: {
    face: "text-ash",
    sweep: "bg-ink-3",
    label: "transition-colors duration-300 group-hover:text-chalk",
  },
  accent: {
    face: "bg-clay text-ink",
    sweep: "bg-chalk",
    label: "",
  },
};

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.8125rem]",
  md: "px-7 py-3.5 text-[0.9375rem]",
  lg: "px-9 py-4 text-[0.9375rem]",
};

const base = [
  "group relative isolate inline-flex select-none items-center justify-center",
  "overflow-hidden rounded-full font-medium",
  "transition-[border-color,opacity] duration-300",
  "active:translate-y-px",
  "disabled:pointer-events-none disabled:opacity-45",
].join(" ");

/**
 * The arrow that travels: the resting one leaves, a second enters behind it.
 * An icon rather than the label, because masking Arabic text clips the dots
 * under letters like ب and ي.
 */
export function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("relative block size-4 overflow-hidden", className)}
    >
      <ArrowLeft className="absolute inset-0 size-4 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-x-full" />
      <ArrowLeft className="absolute inset-0 size-4 translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0" />
    </span>
  );
}

interface Shared {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

function Face({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  const tone = VARIANTS[variant];

  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-right scale-x-0",
          "transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
          "group-hover:scale-x-100",
          tone.sweep
        )}
      />
      <span className={cn("relative flex items-center gap-3", tone.label)}>
        {children}
      </span>
    </>
  );
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: Shared & ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(base, VARIANTS[variant].face, SIZES[size], className)}
    >
      <Face variant={variant}>{children}</Face>
    </button>
  );
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: Shared & ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(base, VARIANTS[variant].face, SIZES[size], className)}
    >
      <Face variant={variant}>{children}</Face>
    </Link>
  );
}
