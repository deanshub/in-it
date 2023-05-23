const withInItStats = require('next-in-it-stats')({
  legacy: true,
  // serverUrl: '',
  // serverUrl: 'http://localhost:3001/api/stats',
});

/** @type {import('next').NextConfig} */
const nextConfig = withInItStats({
  experimental: {
    appDir: true,
     serverComponentsExternalPackages: ["mongoose"]
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  },
});

module.exports = nextConfig;
