import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ['192.168.0.2', '192.168.0.72', '192.168.0.45'],
  experimental: {
    webpackBuildWorker: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
