export type VideoSource = { src: string; type: string };

function mimeFor(src: string): string {
  const path = src.split("?")[0].toLowerCase();
  if (path.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

export function videoSources(src?: string | null): VideoSource[] {
  const value = src?.trim();
  if (!value) return [];

  const type = mimeFor(value);

  if (value.startsWith("/videos/")) {
    return [{ src: value, type }];
  }

  if (/^https?:\/\//i.test(value)) {
    const file = value.split("/").pop();
    if (file) {
      return [{ src: `/videos/${file}`, type }];
    }
    return [{ src: value, type }];
  }

  return [{ src: value, type }];
}

export function imageSrc(src?: string | null): string | null {
  const value = src?.trim();
  if (!value) return null;
  return value;
}
