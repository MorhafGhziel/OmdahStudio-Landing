"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpLeft, X } from "lucide-react";
import { EASE } from "@/lib/motion";
import type { WorkType } from "@/lib/types";
import { ProjectDetail } from "./ProjectDetail";

interface ProjectModalProps {
  project: WorkType | null;
  onClose: () => void;
}

/**
 * The project, opened in place.
 *
 * Clicking a card shows the work here rather than navigating, so the footage
 * starts immediately and the grid is still behind you when you close it. The
 * /works/[slug] route stays live for direct links and crawlers — the card is
 * a real anchor, and only a plain left click is intercepted.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!project) return;

    restoreFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      // Send focus back where it came from, so keyboard users land on the
      // card they opened rather than at the top of the document.
      (restoreFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] overflow-y-auto bg-ink/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <div className="gutter flex min-h-full items-start justify-center py-6 sm:py-12">
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="project-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-full max-w-5xl rounded-lg border border-hairline bg-ink-2"
            >
              {/* ---- Header ---- */}
              <header className="flex items-start justify-between gap-6 border-b border-hairline p-5 sm:p-7">
                <div className="min-w-0">
                  <h2
                    id="project-title"
                    className="t-serif truncate text-3xl text-chalk sm:text-4xl"
                  >
                    {project.title}
                  </h2>
                  <p className="mt-1.5 text-[0.9375rem] text-smoke">
                    {project.category}
                    <span className="mx-2 text-clay">/</span>
                    {project.client}
                    <span className="mx-2 text-clay">/</span>
                    {project.year}
                  </p>
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-smoke transition-colors hover:border-chalk hover:text-chalk"
                >
                  <X className="size-4" />
                </button>
              </header>

              {/* ---- Body ---- */}
              <div className="p-5 sm:p-7">
                <ProjectDetail project={project} autoPlay />

                <div className="mt-10 flex justify-end border-t border-hairline pt-6">
                  <Link
                    href={project.link ?? "#"}
                    className="link-rule inline-flex items-center gap-2 text-[0.9375rem] text-chalk"
                  >
                    <ArrowUpLeft className="size-4" />
                    افتح صفحة المشروع
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
