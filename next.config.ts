import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  allowedDevOrigins: ["192.168.0.45", "localhost", "127.0.0.1"],

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;