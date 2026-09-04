"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { inView, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Geometry. Everything is measured from the centre of a 400×400 box.
   ------------------------------------------------------------------ */

const C = 200; // centre
const R_BARREL = 188; // outer edge of the lens body
const R_GRIP_IN = 152; // inner edge of the knurled focus ring
const R_INNER = 148; // inner barrel wall
const R_PLATE = 120; // the iris blade plate
const R_GLASS = 114; // front element
const R_IRIS = 66; // aperture opening at its widest

/**
 * Object shading, deliberately lighter than any page surface. A physical
 * thing lit from the upper left cannot be built out of the flat background
 * tiers — those are for planes, and this needs to read as a solid.
 */
const TONE = {
  barrelLit: "#332e2b",
  barrelShade: "#131110",
  innerLit: "#211d1b",
  innerShade: "#0b0a09",
  bladeLit: "#2a2523",
  bladeShade: "#151312",
};

/** angle 0 = top, increasing clockwise. */
const polar = (angle: number, radius: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return [C + Math.cos(rad) * radius, C + Math.sin(rad) * radius] as const;
};

/**
 * A tick standing on a radius, drawn at the top and rotated into place.
 * The y origin is `C - rOuter`, not the radius itself — getting that wrong
 * buries the marks near the centre, under the glass.
 */
const tick = (rOuter: number, rInner: number, width: number) => ({
  x: C - width / 2,
  y: C - rOuter,
  width,
  height: rOuter - rInner,
  rx: width / 2,
});

const arc = (from: number, to: number, radius: number) => {
  const [x1, y1] = polar(from, radius);
  const [x2, y2] = polar(to, radius);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

/** Eight blades — the count most cine primes actually use. */
const BLADES = 8;
const STEP = 360 / BLADES;

const APERTURE = Array.from({ length: BLADES }, (_, i) => {
  const [x, y] = polar(i * STEP + STEP / 2, R_IRIS);
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}).join(" ");

/** Each blade's trailing edge, swept back from its vertex toward the barrel. */
const SEAMS = Array.from({ length: BLADES }, (_, i) => {
  const angle = i * STEP + STEP / 2;
  const [x1, y1] = polar(angle, R_IRIS);
  const [x2, y2] = polar(angle - 46, R_PLATE);
  return { x1, y1, x2, y2 };
});

/** 60 grip ridges, every fifth one taller and brighter. */
const KNURL = Array.from({ length: 60 }, (_, i) => ({
  angle: i * 6,
  major: i % 5 === 0,
}));

/** Aperture index marks on the inner barrel. */
const STOPS = Array.from({ length: 12 }, (_, i) => i * 30);

/**
 * The studio mark: a cine lens, drawn head-on.
 *
 * Built from filled, shaded areas rather than outlines — a barrel with a
 * knurled focus ring, an eight-blade iris that breathes open and closed, and
 * a front element carrying the warm bloom of a coating. A rim light across
 * the upper left and a bounce along the lower right are what make it read as
 * a solid object rather than a diagram of one.
 *
 * The clay accent appears only as that bloom and the index mark, the same
 * way it behaves everywhere else on the site.
 */
export function Lens({ className }: { className?: string }) {
  // useId returns delimiters that are invalid inside a URL fragment, so a raw
  // `url(#{id})` silently resolves to nothing.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const irisMask = `lens-iris-${uid}`;
  const barrelFill = `lens-barrel-${uid}`;
  const innerFill = `lens-inner-${uid}`;
  const bladeFill = `lens-blade-${uid}`;
  const glassFill = `lens-glass-${uid}`;
  const glassClip = `lens-clip-${uid}`;

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className={cn("size-full", className)}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={inView}
      transition={transition(1.1)}
      role="img"
      aria-label="عدسة عمدة"
    >
      <defs>
        {/* Lit from the upper left, in line with the bloom on the glass. */}
        <linearGradient id={barrelFill} x1="18%" y1="8%" x2="82%" y2="92%">
          <stop offset="0%" stopColor={TONE.barrelLit} />
          <stop offset="100%" stopColor={TONE.barrelShade} />
        </linearGradient>
        <linearGradient id={innerFill} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor={TONE.innerLit} />
          <stop offset="100%" stopColor={TONE.innerShade} />
        </linearGradient>
        <linearGradient id={bladeFill} x1="22%" y1="10%" x2="78%" y2="90%">
          <stop offset="0%" stopColor={TONE.bladeLit} />
          <stop offset="100%" stopColor={TONE.bladeShade} />
        </linearGradient>

        <radialGradient id={glassFill} cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#2b231d" />
          <stop offset="50%" stopColor="#0f0c0a" />
          <stop offset="100%" stopColor="#040303" />
        </radialGradient>

        <clipPath id={glassClip}>
          <circle cx={C} cy={C} r={R_GLASS} />
        </clipPath>

        {/* White shows the blade plate, black cuts the opening out of it.
            The polygon animates, so the hole opens and closes. */}
        <mask id={irisMask}>
          <circle cx={C} cy={C} r={R_PLATE} fill="#fff" />
          <g className="anim-iris" style={{ transformOrigin: `${C}px ${C}px` }}>
            <polygon points={APERTURE} fill="#000" />
          </g>
        </mask>
      </defs>

      {/* ---- Barrel ---- */}
      <circle cx={C} cy={C} r={R_BARREL} fill={`url(#${barrelFill})`} />

      {/* Rim light and bounce — the two strokes that turn a disc into a
          cylinder seen end-on. */}
      <path
        d={arc(272, 356, R_BARREL - 1)}
        fill="none"
        className="stroke-chalk"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.32"
      />
      <path
        d={arc(96, 168, R_BARREL - 1)}
        fill="none"
        className="stroke-clay"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.16"
      />

      {/* ---- Knurled focus ring ---- */}
      <g className="anim-lens-spin" style={{ transformOrigin: `${C}px ${C}px` }}>
        {KNURL.map(({ angle, major }) => (
          <rect
            key={angle}
            // Ridges sit inside the grip band, between R_GRIP_IN and R_BARREL.
            {...(major
              ? tick(R_BARREL - 4, R_GRIP_IN + 2, 4.8)
              : tick(R_BARREL - 9, R_GRIP_IN + 8, 3))}
            className="fill-chalk"
            opacity={major ? 0.34 : 0.15}
            transform={`rotate(${angle} ${C} ${C})`}
          />
        ))}
      </g>

      {/* ---- Inner barrel wall ---- */}
      <circle cx={C} cy={C} r={R_INNER} fill={`url(#${innerFill})`} />
      <circle
        cx={C}
        cy={C}
        r={R_INNER}
        fill="none"
        className="stroke-chalk"
        strokeWidth="1.2"
        opacity="0.16"
      />

      {/* ---- Aperture index ---- */}
      {STOPS.map((angle) => (
        <rect
          key={angle}
          {...tick(R_INNER - 5, R_PLATE + 6, 2.2)}
          className="fill-chalk"
          opacity="0.3"
          transform={`rotate(${angle} ${C} ${C})`}
        />
      ))}
      <rect {...tick(R_INNER - 2, R_PLATE + 3, 3.6)} className="fill-clay" />

      {/* ---- Front element ---- */}
      <circle cx={C} cy={C} r={R_GLASS} fill={`url(#${glassFill})`} />

      <g clipPath={`url(#${glassClip})`}>
        {/* Coating bloom, and the specular sitting inside it. */}
        <ellipse
          cx="156"
          cy="142"
          rx="76"
          ry="46"
          transform="rotate(-34 156 142)"
          className="fill-clay anim-bloom"
        />
        <ellipse
          cx="146"
          cy="132"
          rx="32"
          ry="16"
          transform="rotate(-34 146 132)"
          className="fill-chalk"
          opacity="0.2"
        />
        {/* Secondary flare, opposite the key. */}
        <circle cx="256" cy="260" r="20" className="fill-clay" opacity="0.14" />
      </g>

      {/* ---- Iris ---- */}
      <circle
        cx={C}
        cy={C}
        r={R_PLATE}
        fill={`url(#${bladeFill})`}
        mask={`url(#${irisMask})`}
      />

      {/* Blade seams and the lit edge of the opening move as one with the
          mask polygon — same animation, same duration, so they stay in step. */}
      <g className="anim-iris" style={{ transformOrigin: `${C}px ${C}px` }}>
        {SEAMS.map((seam, i) => (
          <line
            key={i}
            x1={seam.x1}
            y1={seam.y1}
            x2={seam.x2}
            y2={seam.y2}
            className="stroke-chalk"
            strokeWidth="1.1"
            opacity="0.16"
          />
        ))}
        <polygon
          points={APERTURE}
          fill="none"
          className="stroke-chalk"
          strokeWidth="1.6"
          opacity="0.3"
        />
      </g>
    </motion.svg>
  );
}
