/**
 * Media source resolution.
 *
 * Assets live in three places — the public folder, an iDrive e2 bucket, and
 * (historically) arbitrary URLs. Remote files have to travel through our own
 * proxy routes so range requests and CORS behave. This module is the only
 * place that knows those rules.
 */

const isRemote = (src: string) => /^https?:\/\//i.test(src);

export type VideoSource = { src: string; type: string };

function mimeFor(src: string): string {
  const path = src.split("?")[0].toLowerCase();

  // .mov is deliberately advertised as mp4. A browser skips any <source>
  // whose type it reports as unplayable, and Chrome answers
  // canPlayType("video/quicktime") with "" — so labelling these honestly
  // means the source is discarded before a single byte is requested, and
  // four of the five projects here are .mov. The container is ISO base
  // media either way and the codec inside is H.264, so mp4 is the label
  // that describes what the decoder actually receives. The proxy rewrites
  // the response header to match.
  if (path.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

/**
 * Ordered <source> list for a video. The browser walks it top-down, so the
 * proxied URL comes first and the direct file is the fallback.
 */
export function videoSources(src?: string | null): VideoSource[] {
  const value = src?.trim();
  if (!value) return [];

  const type = mimeFor(value);

  if (isRemote(value)) {
    const proxied = `/api/video-proxy?url=${encodeURIComponent(value)}`;
    return [{ src: proxied, type }];
  }

  // Local /videos/* files are streamed through the range-aware route, with the
  // static file kept as a fallback in case the route is unavailable.
  if (value.startsWith("/videos/")) {
    return [
      { src: `/api/video/${value.slice("/videos/".length)}`, type },
      { src: value, type },
    ];
  }

  return [{ src: value, type }];
}

/** Poster / still image URL, proxied only when it needs to be. */
export function imageSrc(src?: string | null): string | null {
  const value = src?.trim();
  if (!value) return null;

  if (isRemote(value) && value.includes("idrivee2.com")) {
    return `/api/image-proxy?url=${encodeURIComponent(value)}`;
  }

  return value;
}
