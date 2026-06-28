import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  reactCompiler: true,
  images: {
    qualities: [70, 75, 80, 85, 90, 95, 100],
  },
};

export default nextConfig;
