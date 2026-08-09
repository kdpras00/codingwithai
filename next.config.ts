import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  allowedDevOrigins: ['verona-unperiodic-sidereally.ngrok-free.dev'],
};

export default nextConfig;
