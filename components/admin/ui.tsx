"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The admin's own small vocabulary.
 *
 * It shares the site's palette but not its manners: no ambient bloom, no
 * grain, no reveal-on-scroll. A tool should feel immediate, so motion here is
 * limited to state that actually changes — a row leaving, a panel arriving.
 */

/* ---------------------------------- head --------------------------------- */

export function PageHead({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  /** Primary action, pinned to the far edge. */
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
      <div>
        <h1 className="t-h2 text-chalk">{title}</h1>
        {description && <p className="t-meta mt-2 text-smoke">{description}</p>}
      </div>
      {children}
    </header>
  );
}

/* --------------------------------- surface -------------------------------- */

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-hairline bg-ink-2/60 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

/** A single record in a list, with its controls at the trailing edge. */
export function Row({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.li
      layout
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-4 border-b border-hairline px-5 py-4 last:border-b-0",
        "transition-colors hover:bg-ink-3/60",
        className
      )}
    >
      {children}
    </motion.li>
  );
}

export function List({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y-0">
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </ul>
  );
}

/* --------------------------------- states -------------------------------- */

export function Loading({ label = "جارٍ التحميل" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-smoke">
      <Loader2 className="size-4 animate-spin" />
      <span className="t-meta">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="t-h3 text-chalk">{title}</p>
      {description && <p className="t-meta mx-auto mt-2 max-w-sm text-smoke">{description}</p>}
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </div>
  );
}

/* -------------------------------- controls -------------------------------- */

export function IconButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...props}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-md border border-hairline text-smoke",
        "transition-colors hover:border-chalk/30 hover:bg-ink-3 hover:text-chalk",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
}

/**
 * Delete, armed by a first click.
 *
 * `window.confirm` blocks the whole page and looks like the browser, not the
 * product. Arming in place says the same thing, stays undoable by waiting,
 * and disarms itself after a few seconds so a stray click cannot linger.
 */
export function DeleteButton({
  onConfirm,
  label = "حذف",
}: {
  onConfirm: () => void;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const click = () => {
    if (armed) {
      setArmed(false);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 4000);
  };

  return (
    <button
      type="button"
      onClick={click}
      aria-label={armed ? "تأكيد الحذف" : label}
      className={cn(
        "t-label-ar flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 transition-colors",
        armed
          ? "border-clay bg-clay text-ink"
          : "border-hairline text-smoke hover:border-clay/50 hover:text-clay"
      )}
    >
      <Trash2 className="size-3.5" />
      {armed && <span>متأكد؟</span>}
    </button>
  );
}

/** Inline feedback under a form or toolbar. */
export function Notice({ kind, children }: { kind: "error" | "ok"; children: ReactNode }) {
  return (
    <p className={cn("t-meta", kind === "error" ? "text-clay" : "text-ash")}>
      {children}
    </p>
  );
}
