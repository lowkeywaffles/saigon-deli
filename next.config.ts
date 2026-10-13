import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name> (set by the deploy workflow); local dev runs at the root.
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
