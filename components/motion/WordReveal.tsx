"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { EASE, inView, stagger, unmask } from "@/lib/motion";

interface WordRevealProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  /** Play on mount instead of waiting for the element to scroll into view. */
  immediate?: boolean;
}

/**
 * Headline reveal: each word wipes up from behind a mask.
 *
 * Splits on whitespace only. Arabic is a cursive script — splitting a word
 * into characters breaks the joining forms and renders nonsense, so the
 * per-letter version of this effect is off the table by design.
 */
export function WordReveal({
  text,
  className,
  as = "span",
  delay = 0,
  immediate = false,
}: WordRevealProps) {
  const Component = (motion[as as "span"] ?? motion.span) as typeof motion.span;
  const words = text.split(/\s+/).filter(Boolean);

  const animateProps = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: inView };

  return (
    <Component
      className={className}
      initial="hidden"
      variants={stagger(0.075, delay)}
      aria-label={text}
      {...animateProps}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          // The mask needs vertical slack, or Arabic descenders and the dots
          // beneath letters get shaved off at rest. The word gap is a margin
          // rather than a space character, because a trailing space inside an
          // inline-block collapses away.
          className="inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] me-[0.26em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={unmask}
            transition={{ duration: 1, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
