import type { Transition, Variants } from "framer-motion";

/**
 * One easing curve for the whole site. Everything decelerates the same way,
 * which is most of what makes a page feel like a single object rather than
 * a pile of components.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_INOUT = [0.76, 0, 0.24, 1] as const;

export const transition = (duration = 0.9, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/** Enter from below with a touch of defocus — reads as "settling into place". */
export const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/** Wipe up from under a mask. Used for headline words and image reveals. */
export const unmask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%" },
};

/** Parent that hands each child a staggered start. */
export const stagger = (each = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: each, delayChildren: delay },
  },
});

/** Shared viewport config: fire once, a little before the element is centred. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
