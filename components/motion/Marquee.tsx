"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. Bigger = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Infinite ticker, driven entirely by CSS so it costs nothing on the main
 * thread. The content is rendered twice and the track slides exactly half its
 * width, which makes the seam invisible. Pauses on hover.
 *
 * The whole thing is pinned to LTR. Under the page's RTL direction an
 * overflowing track anchors to the container's right edge and a flex row grows
 * leftward, so the negative-translate keyframes walk the content off the edge
 * and never cycle it back — which is why the reversed row, starting halfway
 * through its loop, rendered completely empty. Items in an endless loop have
 * no reading order to preserve, so fixing the direction here costs nothing.
 */
export function Marquee({
  children,
  duration = 48,
  reverse = false,
  className,
}: MarqueeProps) {
  return (
    <div dir="ltr" className={cn("marquee fade-x overflow-hidden", className)}>
      <div
        className="marquee-track"
        data-reverse={reverse}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
