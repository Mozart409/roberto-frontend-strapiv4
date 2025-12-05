import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "s3-images-idealcoachingfargate.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  trailingSlash: false,
};

export default nextConfig;
