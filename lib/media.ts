import { SUPABASE_VIDEO_BASE } from "./supabase";

export type VideoSource = { src: string; type: string };

const isRemote = (value: string) => /^https?:\/\//i.test(value);

/**
 * Reels live in the public `videos` bucket and are stored as bare object
 * names ("jedeal.mp4"). Full URLs and legacy "/videos/x" paths are still
 * accepted so old rows keep resolving.
 *
 * No extension rewriting happens here. An earlier version mapped .mov to
 * .mp4 on the way out, which meant a row pointing at a real .mov object
 * requested a filename that did not exist and returned 404 — the fix for a
 * missing transcode belongs in the upload, not in the URL builder.
 */
export function videoSources(src?: string | null): VideoSource[] {
  const value = src?.trim();
  if (!value) return [];

  if (isRemote(value)) return [{ src: value, type: mimeFor(value) }];

  const file = value.split("/").pop();
  if (!file) return [];

  return [{ src: `${SUPABASE_VIDEO_BASE}/${file}`, type: mimeFor(file) }];
}

function mimeFor(src: string): string {
  const path = src.split("?")[0].toLowerCase();
  if (path.endsWith(".webm")) return "video/webm";

  // .mov is declared as mp4 deliberately: a browser skips any <source> whose
  // type it reports as unplayable, and Chrome answers
  // canPlayType("video/quicktime") with "". The container is ISO base media
  // either way, so mp4 describes what the decoder actually receives.
  return "video/mp4";
}

/** Images are plain public paths; nothing to resolve. */
export function imageSrc(src?: string | null): string | null {
  return src?.trim() || null;
}
