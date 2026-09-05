import path from "path";
import type { NextConfig } from "next";

/**
 * Uploaded images live in Supabase Storage, so the optimizer needs its host on
 * the allowlist. It is derived from the same variable the app uses rather than
 * hard-coded, so a project move does not silently blank every uploaded image.
 */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  images: {
    /**
     * Optimization is on.
     *
     * It was disabled, which meant the browser downloaded source assets at
     * full weight — the showreel poster alone is a 4.9MB PNG.
     */
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
