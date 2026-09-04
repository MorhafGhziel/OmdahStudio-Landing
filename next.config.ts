import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  images: {
    /**
     * Optimization is on.
     *
     * It was disabled, which meant the browser downloaded source assets at
     * full weight — the showreel poster alone is a 4.9MB PNG. Every image on
     * the site is served from this origin (remote files travel through
     * /api/image-proxy), so the optimizer can resize and re-encode all of
     * them without a remotePatterns allowlist.
     */
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
