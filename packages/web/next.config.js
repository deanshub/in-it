/* eslint-disable @typescript-eslint/no-var-requires */

const withInItStats = require('next-in-it-stats/cjs')({
  legacy: true,
  // serverUrl: '',
  // serverUrl: 'http://localhost:3001/api',
});
const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nivo'],
  experimental: {
    mdxRs: true,
    esmExternals: 'loose',
    appDir: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withInItStats(withMDX(nextConfig));
