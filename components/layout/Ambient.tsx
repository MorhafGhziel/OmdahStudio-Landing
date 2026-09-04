"use client";

import { useEffect } from "react";

/**
 * The light in the room.
 *
 * A fixed layer under everything, carrying an overhead bloom plus a soft spot
 * that tracks the pointer — the page reads as lit rather than as a flat black
 * rectangle. The gradients themselves live in CSS; this only feeds them the
 * pointer position.
 *
 * Deliberately not floating blurred orbs. The distinction that matters is
 * that this never moves on its own: it responds to you, or it sits still.
 */
export function Ambient() {
  useEffect(() => {
    // Coarse pointers have nothing to follow, and the CSS already drops the
    // tracking gradient for them — so don't even listen.
    if (!window.matchMedia("(hover: hover)").matches) return;

    const root = document.documentElement;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      // One write per frame at most; pointermove fires far faster than paint.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="ambient" aria-hidden />;
}
