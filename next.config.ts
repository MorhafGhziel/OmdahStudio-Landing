import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static file serving for videos
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "video/mp4",
          },
        ],
      },
    ];
  },
  // Enable static file serving
  trailingSlash: false,
  // Optimize for large files
  experimental: {
    largePageDataBytes: 128 * 1024 * 1024, // 128MB
  },
  // Enable static file optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
