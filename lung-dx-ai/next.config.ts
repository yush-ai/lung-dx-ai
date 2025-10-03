import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  outputFileTracingRoot: __dirname
};

export default nextConfig;