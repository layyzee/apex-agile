/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['node:sqlite'],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
