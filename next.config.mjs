/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["playwright", "playwright-core"],
  },
  serverExternalPackages: ["playwright", "playwright-core"],
};

export default nextConfig;
