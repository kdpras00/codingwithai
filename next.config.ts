import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: true,
  },
  distDir: '.next.nosync',
  allowedDevOrigins: ['verona-unperiodic-sidereally.ngrok-free.dev'],
};

export default nextConfig;
