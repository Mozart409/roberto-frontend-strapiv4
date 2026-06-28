import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "localhost",
    "127.0.0.1",
  ],
  images: {
    // Next 16 blocks optimizing images that resolve to a private IP (SSRF
    // guard). The local Strapi lives on localhost, so allow it in dev only;
    // prod talks to the public Strapi domain and must not carry this flag.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname:
          "s3-images-idealcoachingfargate.s3.eu-central-1.amazonaws.com",
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
