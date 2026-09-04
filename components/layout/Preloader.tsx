"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { EASE, EASE_INOUT } from "@/lib/motion";

const SEEN_KEY = "omdah:intro-seen";

/** Whether this session has already been shown the curtain. */
const neverChanges = () => () => {};

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== null;
  } catch {
    // Storage blocked — behave as if it has already played.
    return true;
  }
}

/** Server-rendered HTML carries no curtain, so the page is useful without JS. */
const seenOnServer = () => true;

/**
 * The curtain. Shown once per browser session, so coming back from a project
 * page doesn't replay it — an intro you can't skip is a toll booth.
 */
export function Preloader() {
  const reduceMotion = useReducedMotion();
  const seen = useSyncExternalStore(neverChanges, readSeen, seenOnServer);
  const [dismissed, setDismissed] = useState(false);

  const show = !seen && !dismissed && !reduceMotion;

  useEffect(() => {
    if (!show) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Nothing to remember it with; the timer still runs. */
    }

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setDismissed(true), 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="curtain"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE_INOUT }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <Image
              src="/icons/logo_white_v2.svg"
              alt=""
              width={200}
              height={104}
              priority
              className="h-16 w-auto"
            />
          </motion.div>

          {/* A rule that fills as the page settles. */}
          <div className="mt-10 h-px w-40 overflow-hidden bg-ink-3">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.3, ease: EASE }}
              className="h-full w-full origin-right bg-chalk"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
