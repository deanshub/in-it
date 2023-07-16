import { join } from 'path';
import LegacyInItStatsPlugin from 'legacy-in-it-stats-plugin';
import type { NextStatsPluginOptions } from 'in-it-shared-types';
import type { NextConfig } from 'next';

// TODO: use options (appId)
function nextInItStats({
  legacy = false,
  outDir = './in-it-stats',
  serverUrl = 'https://in-it.nissix.com/api',
  name,
}: Partial<NextStatsPluginOptions> = {}) {
  return (nextConfig: NextConfig = {}) => {
    // if in dev mode and not requested explicitly
    if (process.env.NODE_ENV !== 'production' && process.env.ANALYZE !== 'true') {
      return nextConfig;
    }
    const nextConfigWithInItStats: NextConfig = {
      ...nextConfig,
      webpack(config, options) {
        if (!legacy) {
          throw new Error('next-in-it-stats: modern mode is not supported yet');
        }
        let reportFilename;
        if (outDir.startsWith('.')) {
          reportFilename = join(
            process.cwd(),
            options.config.distDir,
            outDir,
            `${options.nextRuntime ?? 'client'}.json`,
          );
        } else {
          reportFilename = join(outDir, `${options.nextRuntime ?? 'client'}.json`);
        }

        // const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        // const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');

        // const InItStatsWebpackPlugin = require('./InItStatsWebpackPlugin').default;
        // const InItStatsWebpackPlugin = (await import('./InItStatsWebpackPlugin.js')).default;

        config.plugins.push(
          new LegacyInItStatsPlugin({
            serverUrl,
            reportFilename,
            buildId: options.buildId,
            outDir: join(process.cwd(), options.config.distDir),
            name,
          }),
        );
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    };
    return nextConfigWithInItStats;
  };
}

export default nextInItStats;
// @ts-expect-error-next-line
export = nextInItStats;
