const withInItStats = require('next-in-it-stats')();

/** @type {import('next').NextConfig} */
const nextConfig = withInItStats({
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
