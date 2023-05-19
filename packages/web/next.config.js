const withInItStats = require('next-in-it-stats')({
  serverUrl: '',
  // serverUrl: 'http://localhost:3001/api/stats',
});

/** @type {import('next').NextConfig} */
const nextConfig = withInItStats({
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
