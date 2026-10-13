import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";
const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,

  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);