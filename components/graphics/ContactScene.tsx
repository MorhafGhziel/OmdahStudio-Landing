"use client";

import { Check } from "lucide-react";
import { useRef } from "react";
import { Piece, usePointerParallax, type Vars } from "@/components/motion/Scene";
import { Slate } from "./Slate";

/**
 * The contact illustration: a slate with the fragments of a shoot floating
 * around it — tally, timecode, levels, delivery.
 *
 * Everything is drawn in markup rather than shipped as an image, so it stays
 * crisp at any size, recolours with the palette, and animates for free. The
 * pieces read as one scene because they share a light direction, one
 * hairline weight and one accent.
 */

const CANVAS_W = 520;
const CANVAS_H = 440;

/** Audio levels. Fixed heights, each bar breathing on its own clock. */
const LEVELS = [
  { h: 34, dur: 0.9, delay: 0 },
  { h: 62, dur: 1.25, delay: 0.15 },
  { h: 46, dur: 1.05, delay: 0.3 },
  { h: 80, dur: 1.4, delay: 0.08 },
  { h: 55, dur: 1.1, delay: 0.42 },
  { h: 70, dur: 0.95, delay: 0.22 },
];

const card =
  "rounded-lg border border-hairline bg-ink-2/90 backdrop-blur-sm " +
  "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.9)]";

export function ContactScene() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerParallax(ref);

  return (
    <div className="flex justify-center overflow-hidden lg:justify-start">
      <div
        ref={ref}
        aria-hidden
        /* Latin runs inside — timecode, REC — must not be reordered by the
           page's RTL direction, and the canvas coordinates below are all
           left-origin. */
        dir="ltr"
        /*
         * The canvas is a fixed pixel stage, scaled down on small screens.
         * A transform does not change the box the element reserves, so the
         * negative margins give back the height the scale stopped using —
         * without them the section carried 167px of dead space under the
         * scene on a phone. Origin is the top edge so the scene stays put
         * while it shrinks.
         */
        className={
          "relative shrink-0 origin-top scale-[0.62] mb-[-167px] " +
          "sm:scale-75 sm:mb-[-110px] lg:scale-100 lg:mb-0"
        }
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        {/* The field it all sits on, furthest back. */}
        <div
          className="scene-par absolute inset-0"
          style={
            {
              "--d": 0.16,
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--color-clay) 26%, transparent) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse 60% 56% at 50% 50%, #000 18%, transparent 76%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 56% at 50% 50%, #000 18%, transparent 76%)",
            } as Vars
          }
        />

        {/* ---------- the slate, the anchor ---------- */}
        <Piece x={88} y={36} w={318} depth={0.34} dur={9} amp={-10} z={2}>
          <Slate />
        </Piece>

        {/* ---------- recording tally ---------- */}
        <Piece x={4} y={70} depth={0.85} dur={6.2} amp={-14} rot={[-3, -1]} z={4}>
          <div className={`${card} flex items-center gap-2.5 px-3.5 py-2`}>
            <span className="rec-dot size-2 rounded-full bg-clay" />
            <span className="t-label text-chalk/80">REC</span>
          </div>
        </Piece>

        {/* ---------- timecode ---------- */}
        <Piece x={386} y={52} depth={0.7} dur={7.4} amp={-12} rot={[2, 0]} z={4}>
          <div className={`${card} px-3.5 py-2`}>
            <span className="t-label block text-smoke">TC</span>
            <span className="mt-1 block font-medium tabular-nums text-chalk">
              00:00:14:08
            </span>
          </div>
        </Piece>

        {/* ---------- audio levels ---------- */}
        <Piece x={0} y={262} depth={0.62} dur={8.1} amp={-11} rot={[-2, 1]} z={3}>
          <div className={`${card} px-4 py-3`}>
            <span className="t-label block text-smoke">LEVELS</span>
            <div className="mt-2.5 flex h-12 items-end gap-1.5">
              {LEVELS.map((bar, i) => (
                <span
                  key={i}
                  className="meter-bar w-1.5 rounded-full bg-clay/70"
                  style={
                    {
                      height: `${bar.h}%`,
                      "--dur": `${bar.dur}s`,
                      "--delay": `${bar.delay}s`,
                    } as Vars
                  }
                />
              ))}
            </div>
          </div>
        </Piece>

        {/* ---------- delivered ---------- */}
        <Piece x={232} y={356} depth={0.95} dur={6.8} amp={-15} rot={[2, -1]} z={5}>
          <div className={`${card} flex items-center gap-3 px-4 py-3`}>
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-clay text-ink">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            {/* Arabic inside an LTR canvas needs its direction back. */}
            <span dir="rtl" className="t-label-ar text-chalk">
              تم التسليم
            </span>
          </div>
        </Piece>

        {/* ---------- film strip ---------- */}
        <Piece x={442} y={220} depth={0.5} dur={9.5} amp={-9} rot={[8, 5]} z={1}>
          <div className="overflow-hidden rounded-md border border-hairline bg-ink-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 border-b border-hairline px-1.5 py-1.5 last:border-b-0"
              >
                <span className="size-1.5 rounded-[1px] bg-smoke/70" />
                <span className="h-6 w-9 rounded-[2px] border border-hairline bg-ink-2" />
                <span className="size-1.5 rounded-[1px] bg-smoke/70" />
              </div>
            ))}
          </div>
        </Piece>
      </div>
    </div>
  );
}
