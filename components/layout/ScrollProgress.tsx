"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline of clay across the top edge — the only always-on chrome. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-right bg-clay"
    />
  );
}
