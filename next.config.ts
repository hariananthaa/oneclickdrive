import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.oneclickdrive.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
