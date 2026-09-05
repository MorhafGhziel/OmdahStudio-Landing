"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   A cine slate, drawn in a 400×400 box.

   The object earns its place: a slate is what you clap to *start* a take,
   which is the one thing this section is asking the visitor to do. It is
   also mechanical rather than cute — it has a hinge, a weight and a snap,
   so it can carry motion without turning the page into a cartoon.
   ------------------------------------------------------------------ */

const BOARD = { x: 44, y: 150, w: 312, h: 196, r: 9 };

/** The fixed jaw, fused to the top of the board. */
const JAW = { x: 44, y: 118, w: 312, h: 32 };

/** The moving stick. Its hinge is the left end, where it meets the jaw. */
const STICK = { x: 44, y: 84, w: 312, h: 32, r: 5 };

/**
 * Object shading, deliberately lighter than any page surface — the same
 * rule the lens follows. A solid cannot be built out of the flat background
 * tiers, which describe planes.
 */
const TONE = {
  faceLit: "#2b2724",
  faceShade: "#131110",
  jaw: "#1a1816",
  stripe: "#e8e3da",
  stripeShade: "#1d1a18",
  // The jaw sits in the stick's shadow, so its stripes are the same pattern
  // held two stops down rather than the bright ones at reduced opacity —
  // which only ever reads as grey mush.
  jawStripe: "#6f6862",
  jawStripeShade: "#141210",
};

/** Eight slanted stripes, the count a real clapper carries. */
const STRIPES = 8;
const SLANT = 13;

function stripes(box: { x: number; y: number; w: number; h: number }) {
  const step = box.w / STRIPES;
  return Array.from({ length: STRIPES }, (_, i) => {
    const left = box.x + i * step;
    return {
      key: i,
      lit: i % 2 === 0,
      // A parallelogram: the top edge leads the bottom edge by SLANT.
      points: [
        `${left + SLANT},${box.y}`,
        `${left + step + SLANT},${box.y}`,
        `${left + step},${box.y + box.h}`,
        `${left},${box.y + box.h}`,
      ].join(" "),
    };
  });
}

/** What the board says. Latin, small caps — the same voice as the wall labels. */
const ROWS = [
  { label: "PROD.", value: "OMDAH" },
  { label: "SCENE", value: "YOURS" },
  { label: "TAKE", value: "01" },
  { label: "ROLL", value: "A" },
];

export function Slate({ className }: { className?: string }) {
  // useId's raw output carries characters that are not valid in a URL
  // fragment, which silently kills every url(#…) reference in the file.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduced = useReducedMotion();

  const face = `face${uid}`;
  const bloom = `bloom${uid}`;
  const clip = `clip${uid}`;
  const jawClip = `jawclip${uid}`;
  const sweep = `sweep${uid}`;

  /* The clap: lift, hold, snap shut, rest. The snap is the fast part —
     a slate that closes at the same speed it opens reads as a toy. */
  const stickMotion = reduced
    ? {}
    : {
        animate: { rotate: [0, -25, -25, 0, 0] },
        transition: {
          duration: 4.4,
          times: [0, 0.16, 0.42, 0.48, 1],
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1] as const,
        },
      };

  /* The flash fires on the frame the stick lands, not on a timer of its
     own — the two share one duration so they cannot drift apart. */
  const flashMotion = reduced
    ? { animate: { opacity: 0 } }
    : {
        animate: { opacity: [0, 0, 0, 0.5, 0] },
        transition: {
          duration: 4.4,
          times: [0, 0.16, 0.47, 0.5, 0.62],
          repeat: Infinity,
          ease: "linear" as const,
        },
      };

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className={cn("w-full", className)}
      role="img"
      aria-label="لوح تصوير سينمائي"
      /*
       * SVG text inherits the document's direction, and this page is RTL.
       * Left unset, bidi moves the period in "PROD." to the front and
       * text-anchor="end" resolves to the left edge, so the values ran off
       * the board instead of sitting flush to its right rule.
       */
      style={{ direction: "ltr" }}
      // A slow drift, so the object sits in the room rather than on the page.
      animate={reduced ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id={face} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={TONE.faceLit} />
          <stop offset="100%" stopColor={TONE.faceShade} />
        </linearGradient>

        <radialGradient id={bloom}>
          <stop offset="0%" stopColor="var(--color-clay)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="var(--color-clay)" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={sweep} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* Stripes are drawn as full parallelograms and cropped to the bar,
            so the slant runs off both ends instead of being mitred. */}
        <clipPath id={clip}>
          <rect x={STICK.x} y={STICK.y} width={STICK.w} height={STICK.h} rx={STICK.r} />
        </clipPath>
        <clipPath id={jawClip}>
          <rect x={JAW.x} y={JAW.y} width={JAW.w} height={JAW.h} />
        </clipPath>
      </defs>

      {/* The light it sits in */}
      <ellipse cx="200" cy="235" rx="190" ry="170" fill={`url(#${bloom})`} />

      {/* ---- Board ---- */}
      <g>
        <rect
          x={BOARD.x}
          y={BOARD.y}
          width={BOARD.w}
          height={BOARD.h}
          rx={BOARD.r}
          fill={`url(#${face})`}
          stroke="var(--color-hairline)"
        />

        {ROWS.map((row, i) => {
          const y = BOARD.y + 42 + i * 38;
          return (
            <g key={row.label}>
              <line
                x1={BOARD.x + 18}
                x2={BOARD.x + BOARD.w - 18}
                y1={y + 12}
                y2={y + 12}
                stroke="var(--color-hairline)"
              />
              <text
                x={BOARD.x + 22}
                y={y}
                fill="var(--color-smoke)"
                fontSize="13"
                letterSpacing="2.5"
                fontFamily="var(--font-ui)"
              >
                {row.label}
              </text>
              <text
                x={BOARD.x + BOARD.w - 22}
                y={y}
                textAnchor="end"
                fill="var(--color-chalk)"
                fontSize="17"
                letterSpacing="1.5"
                fontFamily="var(--font-ui)"
              >
                {row.value}
              </text>
            </g>
          );
        })}

        {/* Colour reference chips, as a real slate carries. They are also
            the only place any colour lands on the object. */}
        {["var(--color-clay)", "var(--color-ash)", "var(--color-smoke)"].map(
          (fill, i) => (
            <rect
              key={fill}
              x={BOARD.x + 22 + i * 20}
              y={BOARD.y + BOARD.h - 24}
              width="14"
              height="10"
              rx="2"
              fill={fill}
            />
          )
        )}
      </g>

      {/* ---- Fixed jaw ---- */}
      <g clipPath={`url(#${jawClip})`}>
        <rect x={JAW.x} y={JAW.y} width={JAW.w} height={JAW.h} fill={TONE.jaw} />
        {stripes(JAW).map((s) => (
          <polygon
            key={s.key}
            points={s.points}
            fill={s.lit ? TONE.jawStripe : TONE.jawStripeShade}
          />
        ))}
      </g>

      {/* ---- The stick ---- */}
      <motion.g
        style={{
          transformBox: "fill-box",
          transformOrigin: "0% 100%",
        }}
        {...stickMotion}
      >
        <g clipPath={`url(#${clip})`}>
          <rect
            x={STICK.x}
            y={STICK.y}
            width={STICK.w}
            height={STICK.h}
            fill={TONE.jaw}
          />
          {stripes(STICK).map((s) => (
            <polygon
              key={s.key}
              points={s.points}
              fill={s.lit ? TONE.stripe : TONE.stripeShade}
            />
          ))}
        </g>
        <rect
          x={STICK.x}
          y={STICK.y}
          width={STICK.w}
          height={STICK.h}
          rx={STICK.r}
          fill="none"
          stroke="var(--color-hairline)"
        />
        {/* The hinge pin */}
        <circle cx={STICK.x + 13} cy={STICK.y + STICK.h - 4} r="4" fill="var(--color-smoke)" />
      </motion.g>

      {/* ---- The flash on impact ---- */}
      <motion.rect
        x={BOARD.x}
        y={JAW.y}
        width={BOARD.w}
        height={BOARD.h + JAW.h}
        rx={BOARD.r}
        fill={`url(#${sweep})`}
        style={{ mixBlendMode: "overlay" }}
        {...flashMotion}
      />
    </motion.svg>
  );
}
