import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Lets your phone / other devices on the Wi-Fi receive hot reload (HMR).
  // Add every LAN IP you open the app from (check "Network:" in the terminal).
  allowedDevOrigins: ["192.168.0.45", "localhost", "127.0.0.1"],

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;