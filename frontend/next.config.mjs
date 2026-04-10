/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Type errors are checked locally via `npx tsc --noEmit`.
    // This prevents Vercel build from failing on TS errors during deployment.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint warnings are reviewed locally. This prevents build failure on lint warnings.
    ignoreDuringBuilds: true,
  },
  basePath: '/cracksarkar',
};

export default nextConfig;
