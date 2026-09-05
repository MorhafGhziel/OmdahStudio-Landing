"use client";

import { useRef } from "react";
import { Piece, usePointerParallax, type Vars } from "@/components/motion/Scene";

/**
 * A length of film running through the section.
 *
 * The band above it asks "عندك فكرة؟ / خلنا نحولها لواقع", and the strip is
 * that sentence rather than an illustration sitting next to it: the frames
 * progress from a scribble, through a blocked-out composition and a lit
 * scene, to a finished shot. Watch one frame travel the width and you have
 * read the headline again.
 *
 * It is one object on purpose. An earlier version scattered small status
 * cards around a centre piece, which is a SaaS dashboard's way of filling
 * space and says nothing about a film studio.
 */

const FRAME_W = 132;
const FRAME_H = 94;
const GAP = 16;
const PITCH = FRAME_W + GAP;

/* Four frames, rendered twice. The strip travels exactly one copy's width,
   so the loop closes and the seam never appears. */
const CYCLE = 4;
const PERFS_PER_FRAME = 4;

const CANVAS_W = 520;
const CANVAS_H = 340;

/* ---------------------------------------------------------------- frames */

/** 1 — the idea. A line that draws itself, then clears and starts again. */
function Sketch() {
  return (
    <svg viewBox="0 0 132 94" className="size-full">
      <path
        className="sketch-draw"
        d="M22 68 C 34 30, 52 26, 60 44 C 68 62, 84 60, 90 40 C 95 24, 108 26, 112 36"
        fill="none"
        stroke="var(--color-smoke)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="112" cy="36" r="3" fill="var(--color-clay)" />
    </svg>
  );
}

/** 2 — the frame is composed: thirds, and a subject placed on one. */
function Composition() {
  return (
    <svg viewBox="0 0 132 94" className="size-full">
      <g stroke="var(--color-hairline)" strokeWidth="1">
        <line x1="44" y1="0" x2="44" y2="94" />
        <line x1="88" y1="0" x2="88" y2="94" />
        <line x1="0" y1="31" x2="132" y2="31" />
        <line x1="0" y1="63" x2="132" y2="63" />
      </g>
      <circle
        cx="88"
        cy="31"
        r="13"
        fill="none"
        stroke="var(--color-clay)"
        strokeWidth="2"
      />
      <rect x="80" y="44" width="16" height="30" rx="3" fill="var(--color-ink-2)" />
    </svg>
  );
}

/** 3 — it is lit. A key from one side, a horizon, a figure. */
function Lit({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 132 94" className="size-full">
      <defs>
        <radialGradient id={`key${uid}`} cx="0.24" cy="0.28" r="0.75">
          <stop offset="0%" stopColor="var(--color-chalk)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--color-chalk)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="132" height="94" fill={`url(#key${uid})`} />
      <line x1="0" y1="66" x2="132" y2="66" stroke="var(--color-hairline)" />
      <path d="M74 66 v-22 a10 10 0 0 1 20 0 v22 z" fill="var(--color-ink)" />
      <circle cx="84" cy="36" r="8" fill="var(--color-ink)" />
    </svg>
  );
}

/** 4 — delivered. The one frame that carries colour. */
function Finished({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 132 94" className="size-full">
      <defs>
        <linearGradient id={`fin${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-clay)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-clay-deep)" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="132" height="94" fill={`url(#fin${uid})`} />
      <path d="M58 36 L82 47 L58 58 Z" fill="var(--color-chalk)" />
    </svg>
  );
}

/* ----------------------------------------------------------------- strip */

function Frame({ index, uid }: { index: number; uid: string }) {
  /* Laid out left-to-right, but the page reads right-to-left — so the
     order is reversed here and a reader scanning from the right meets the
     sketch first and the finished frame last. */
  const inner = [
    <Finished key="f" uid={uid} />,
    <Lit key="l" uid={uid} />,
    <Composition key="c" />,
    <Sketch key="s" />,
  ][index % CYCLE];

  return (
    <div
      className="shrink-0 overflow-hidden rounded-[3px] border border-hairline bg-ink-3"
      style={{ width: FRAME_W, height: FRAME_H, marginInlineEnd: GAP }}
    >
      {inner}
    </div>
  );
}

/** One run of perforations, sized to sit above or below the frame row. */
function Perforations({ count }: { count: number }) {
  return (
    <div className="flex" style={{ width: count * (PITCH / PERFS_PER_FRAME) }}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="shrink-0 rounded-[2px] bg-ink"
          style={{
            width: 13,
            height: 10,
            marginInlineEnd: PITCH / PERFS_PER_FRAME - 13,
          }}
        />
      ))}
    </div>
  );
}

export function Reel() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerParallax(ref);

  const uid = "reel";
  const total = CYCLE * 2;
  const perfCount = total * PERFS_PER_FRAME;

  return (
    /* No overflow clip here: the strip is wider than its column on purpose,
       and its own mask is what ends it. Clipping cut the fade off partway and
       left a hard diagonal edge. The page already hides horizontal overflow. */
    <div className="flex justify-center lg:justify-start">
      <div
        ref={ref}
        aria-hidden
        /* Canvas coordinates are left-origin, and the strip must run in one
           consistent direction regardless of the page being RTL. */
        dir="ltr"
        className={
          "relative shrink-0 origin-top scale-[0.66] mb-[-116px] " +
          "sm:scale-[0.8] sm:mb-[-68px] lg:scale-100 lg:mb-0"
        }
        style={{ width: CANVAS_W, height: CANVAS_H }}
      >
        {/* The room behind it. */}
        <div
          className="scene-par absolute inset-0"
          style={
            {
              "--d": 0.14,
              background:
                "radial-gradient(ellipse 58% 46% at 50% 50%, color-mix(in oklab, var(--color-clay) 13%, transparent), transparent 72%)",
            } as Vars
          }
        />

        {/* ---- the strip ---- */}
        <Piece x={-90} y={86} depth={0.4} dur={11} amp={-8} rot={[-13, -12]} z={2}>
          <div
            className="relative"
            style={{ width: 700 }}
          >
            {/* Both ends fade rather than cut, so the reel reads as
                continuing past the frame instead of stopping at it. */}
            <div
              className="relative overflow-hidden py-2"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, #000 17%, #000 83%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 17%, #000 83%, transparent)",
              }}
            >
              <div className="reel-weave">
                <div
                  className="reel-run flex w-max flex-col gap-2 bg-ink-2 px-0 py-2 ring-1 ring-hairline"
                  style={{ "--reel-shift": `-${CYCLE * PITCH}px`, "--dur": "30s" } as Vars}
                >
                  <Perforations count={perfCount} />

                  <div className="flex">
                    {Array.from({ length: total }, (_, i) => (
                      <Frame key={i} index={i} uid={uid} />
                    ))}
                  </div>

                  <Perforations count={perfCount} />
                </div>
              </div>

              {/* The lamp passing over it. */}
              <div
                className="reel-sweep pointer-events-none absolute inset-y-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-chalk) 16%, transparent), transparent)",
                }}
              />
            </div>
          </div>
        </Piece>
      </div>
    </div>
  );
}
