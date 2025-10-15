import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Simple configuration for video serving
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Disable image optimization to avoid conflicts
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
