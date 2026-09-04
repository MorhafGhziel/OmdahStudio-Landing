import { SUPABASE_VIDEO_BASE } from "./supabase";

export type VideoSource = { src: string; type: string };

/**
 * Every video lives in Supabase Storage. This module resolves local-looking
 * paths (e.g. /videos/Foo.mov) into full Supabase public URLs. The .mov
 * files were re-encoded to .mp4 during upload, so extensions are normalised.
 */
export function videoSources(src?: string | null): VideoSource[] {
  const value = src?.trim();
  if (!value) return [];

  // Extract the filename, swap .mov → .mp4
  const raw = value.split("/").pop() ?? value;
  const file = raw.replace(/\.mov$/i, ".mp4");

  return [{ src: `${SUPABASE_VIDEO_BASE}/${file}`, type: "video/mp4" }];
}

export function imageSrc(src?: string | null): string | null {
  return src?.trim() || null;
}
