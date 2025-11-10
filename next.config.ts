import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any hostname over HTTPS
      },
      {
        protocol: "http",
        hostname: "**", // Allow any hostname over HTTP (optional, less secure)
      },
    ],
    dangerouslyAllowSVG: true, // if you also want to allow SVGs
  },
};

export default nextConfig;
