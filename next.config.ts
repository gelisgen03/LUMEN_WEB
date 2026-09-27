import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Team portraits are hosted on Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/dpuo4ow5h/**" }],
  },
  poweredByHeader: false,
  // A stray lockfile higher up the disk would otherwise be picked as the workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);
