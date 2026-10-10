import type { NextConfig } from "next";

// GitHub Pages serves the site from /sultan-cafe; local dev runs at the root.
const base = process.env.PAGES_BASE ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE: base },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
