"use client";

import { useEffect, useRef, useState } from "react";
import { imageSrc, videoSources } from "@/lib/media";
import { cn } from "@/lib/utils";
import { SmartImage } from "./SmartImage";
import { Play, Pause } from "lucide-react";

interface SmartVideoProps {
  src?: string | null;
  poster?: string | null;
  className?: string;
  mode?: "ambient" | "player";
  active?: boolean;
  soundOn?: boolean;
  autoPlay?: boolean;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}

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
  const [failed, setFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const sources = videoSources(src);
  const hasVideo = sources.length > 0 && !failed;

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
      el.play().catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  }, [visible, active, mode, src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "player" || !autoPlay) return;

    el.play().catch(() => {
      el.muted = true;
      el.play().catch(() => {});
    });
  }, [autoPlay, mode, src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "ambient") return;
    el.muted = !soundOn;
  }, [soundOn, mode]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const el = ref.current;
    if (!el) return;

    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const video = hasVideo && (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      poster={mode === "player" ? imageSrc(poster) ?? undefined : undefined}
      muted={mode === "ambient"}
      loop={mode === "ambient"}
      controls={mode === "player"}
      playsInline
      preload={mode === "player" ? "metadata" : "none"}
      onError={() => setFailed(true)}
    >
      {sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );

  return (
    <div className={cn("relative overflow-hidden bg-ink-3", className)}>
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

      {hasVideo && (
        <button
          onClick={togglePlay}
          className={cn(
            "absolute z-30 grid size-12 place-items-center rounded-full border border-chalk/25 backdrop-blur-sm transition-all",
            mode === "ambient"
              ? "start-5 bottom-5 bg-ink/40 text-chalk hover:bg-chalk hover:text-ink"
              : "start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink/60 text-chalk hover:bg-chalk hover:text-ink"
          )}
          aria-label={isPlaying ? "pause" : "play"}
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5 ms-0.5" />
          )}
        </button>
      )}

      {!hasVideo && !poster && (
        <span className="t-label absolute inset-0 grid place-items-center text-smoke">
          no footage
        </span>
      )}
    </div>
  );
}
