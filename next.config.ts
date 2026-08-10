import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  allowedDevOrigins: ['verona-unperiodic-sidereally.ngrok-free.dev'],
};

export default nextConfig;
