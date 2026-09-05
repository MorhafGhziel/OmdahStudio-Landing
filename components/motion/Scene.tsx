"use client";

import {
  useEffect,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Shared machinery for the illustrated scenes.
 *
 * A scene is an anchor with fragments floating around it. Each fragment
 * carries two transforms at once — pointer parallax and an idle float — and
 * one element cannot run both on `transform`, so `Piece` always renders two
 * nested layers. The CSS for both lives in globals.css.
 */

export type Vars = CSSProperties & Record<string, string | number>;

/**
 * Writes --px/--py on the scene root as the pointer crosses the section.
 *
 * rAF-throttled, because pointermove fires far faster than the page paints.
 * Skipped entirely on coarse pointers, which have nothing to follow, and
 * under reduced motion — leaving both variables at 0 so every piece sits
 * still rather than being pinned by a !important override.
 */
export function usePointerParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let frame = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--px", `${tx}px`);
      el.style.setProperty("--py", `${ty}px`);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      tx = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 26;
      ty = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 20;
      schedule();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      schedule();
    };

    // Listen on the whole band, not the canvas: the pointer should steer the
    // scene while the reader is anywhere in the section, including over the
    // copy beside it.
    const host = el.closest("section") ?? el;
    host.addEventListener("pointermove", onMove as EventListener, {
      passive: true,
    });
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

interface PieceProps {
  children: ReactNode;
  /** Position on the scene canvas, in canvas units. */
  x: number;
  y: number;
  w?: number;
  /** Parallax strength. Nearer things move more. */
  depth: number;
  /** Seconds for one float cycle. */
  dur: number;
  delay?: number;
  /** Travel at the top of the float, in px. Negative rises. */
  amp?: number;
  /** Rotation at rest and at the top of the float, in degrees. */
  rot?: [number, number];
  z?: number;
}

export function Piece({
  children,
  x,
  y,
  w,
  depth,
  dur,
  delay = 0,
  amp = -12,
  rot = [0, 0],
  z = 2,
}: PieceProps) {
  return (
    <div
      className="scene-par absolute"
      style={{ left: x, top: y, width: w, zIndex: z, "--d": depth } as Vars}
    >
      <div
        className="scene-float"
        style={
          {
            "--dur": `${dur}s`,
            "--delay": `${delay}s`,
            "--amp": `${amp}px`,
            "--r0": `${rot[0]}deg`,
            "--r1": `${rot[1]}deg`,
          } as Vars
        }
      >
        {children}
      </div>
    </div>
  );
}
