import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: path.join(__dirname),
  
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
