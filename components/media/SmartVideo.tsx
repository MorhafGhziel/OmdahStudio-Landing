"use client";

import { useEffect, useRef, useState } from "react";
import { imageSrc, videoSources } from "@/lib/media";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";

interface SmartVideoProps {
  src?: string | null;
  /** Raw still URL. Resolved and optimized here — pass it unprocessed. */
  poster?: string | null;
  className?: string;
  /**
   * ambient — muted loop that plays only while on screen, no chrome. The
   *   still sits behind and the footage fades over it once it can paint.
   * player  — native controls, nothing starts without a click.
   */
  mode?: "ambient" | "player";
  /** ambient only: hold playback until the parent says so (hover, etc). */
  active?: boolean;
  /** ambient only: unmute. Only ever flipped by a user gesture. */
  soundOn?: boolean;
  /** player only: start playing on mount, with sound if the browser allows. */
  autoPlay?: boolean;
  /** ambient only: this still is the largest paint on the page. */
  priority?: boolean;
  sizes?: string;
  /** Alt text for the still. Empty where a caption already names the piece. */
  alt?: string;
}

/**
 * Every <video> on the site goes through here, so source resolution, the
 * play-while-visible rule, and the failure state are written once.
 */
export function SmartVideo({
  src,
  poster,
  className,
  mode = "ambient",
  active,
  soundOn = false,
  autoPlay = false,
  priority,
  sizes = "100vw",
  alt = "",
}: SmartVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [painted, setPainted] = useState(false);
  const [failed, setFailed] = useState(false);

  const sources = videoSources(src);
  const hasVideo = sources.length > 0 && !failed;

  // Track on-screen state. An ambient clip nobody can see should not be
  // decoding frames — that is most of the battery cost of a video-heavy page.
  //
  // hasVideo is a dependency because every src on this site arrives from a
  // client fetch: on the first render there is no source yet, so no <video>
  // is mounted and there is nothing to observe. Keyed only on mode, this
  // effect ran once against a null ref and never again — which meant ambient
  // clips never started on their own.
  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "ambient") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, hasVideo]);

  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "ambient") return;

    if (visible && (active ?? true)) {
      // Autoplay is only permitted while muted; a rejected promise here is an
      // expected browser policy outcome, not an error worth surfacing.
      el.play().catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  }, [visible, active, mode, src]);

  // Player mode, opened from a click: that click is the user activation the
  // autoplay-with-sound policy asks for, so try it with sound first. If the
  // browser still refuses, fall back to muted — something playing beats a
  // frozen poster.
  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "player" || !autoPlay) return;

    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [autoPlay, mode, src]);

  // `muted` is a DOM property rather than an attribute, so React's declarative
  // form is unreliable. Sound only ever comes on via a click, which keeps
  // autoplay policy satisfied.
  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "ambient") return;
    el.muted = !soundOn;
  }, [soundOn, mode]);

  const video = hasVideo && (
    <video
      ref={ref}
      className={cn(
        "absolute inset-0 size-full object-cover",
        mode === "ambient" &&
          "transition-opacity duration-700 " +
            (painted ? "opacity-100" : "opacity-0")
      )}
      // Player mode keeps the native poster so the controls have something to
      // sit on; ambient mode uses the optimized image layer behind instead.
      poster={mode === "player" ? imageSrc(poster) ?? undefined : undefined}
      muted={mode === "ambient"}
      loop={mode === "ambient"}
      controls={mode === "player"}
      playsInline
      preload="metadata"
      onLoadedData={(e) => {
        // A file whose video track the browser cannot decode still fires
        // loadeddata and still plays its audio — it just paints nothing, so
        // no error ever arrives and the frame sits black. Zero dimensions
        // after metadata is the only reliable tell. Treat it as a failure so
        // the still takes over.
        const el = e.currentTarget;
        if (el.videoWidth === 0 || el.videoHeight === 0) {
          el.pause();
          setFailed(true);
          return;
        }
        setPainted(true);
      }}
      onError={() => setFailed(true)}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );

  return (
    <div className={cn("relative overflow-hidden bg-ink-3", className)}>
      {/* The still. In ambient mode it is the poster the footage fades over;
          in player mode it appears only when there is nothing to play, so a
          missing or unreachable file degrades to a picture rather than an
          empty frame. */}
      {poster && (mode === "ambient" || !hasVideo) && (
        <SmartImage
          src={poster}
          alt={alt}
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      )}

      {video}

      {!hasVideo && !poster && (
        <span className="t-label absolute inset-0 grid place-items-center text-smoke">
          no footage
        </span>
      )}
    </div>
  );
}
