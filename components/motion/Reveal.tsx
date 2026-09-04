"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { inView, rise, transition } from "@/lib/motion";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  /** Seconds to wait before this element starts. */
  delay?: number;
  duration?: number;
  as?: ElementType;
}

/**
 * The site's single scroll-entrance. Everything that appears on scroll uses
 * this, so the whole page shares one rhythm instead of nine different ones.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  as = "div",
  ...props
}: RevealProps) {
  const Component = motion[as as "div"] ?? motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={rise}
      transition={transition(duration, delay)}
      {...props}
    >
      {children}
    </Component>
  );
}
