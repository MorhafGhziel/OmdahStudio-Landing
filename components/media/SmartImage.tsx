"use client";

import Image from "next/image";
import { useState } from "react";
import { imageSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Fill-mode image with proxy resolution and a quiet failure state. A broken
 * asset leaves a tinted plate rather than a browser's broken-image glyph.
 */
export function SmartImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = imageSrc(src);

  if (!resolved || failed) {
    return <div className={cn("bg-ink-3", className)} aria-hidden />;
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
