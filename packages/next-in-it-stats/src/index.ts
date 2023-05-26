import { join } from 'path';
// FOR OPTIMIZATION PURPOSES IMPORTS MOVED TO REQUIERING AT RUNTIME
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// import InItStatsWebpackPlugin from './InItStatsWebpackPlugin';
import type { NextStatsPluginOptions } from 'in-it-shared-types';
import type { NextConfig } from 'next';

// TODO: use options (appId)
function nextInItStats({
  legacy = false,
  outDir = './in-it-stats',
  serverUrl = 'https://nissix.com/api/stats',
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

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const InItStatsWebpackPlugin = require('./InItStatsWebpackPlugin').default;

        config.plugins.push(
          new BundleAnalyzerPlugin({
            // analyzerMode: 'static',
            // openAnalyzer: true,
            // reportFilename: `${reportFilename}.html`,

            analyzerMode: 'json',
            reportFilename,
            logLevel: 'silent',
          }),
          new InItStatsWebpackPlugin({
            serverUrl,
            reportFilename,
            buildId: options.buildId,
            outDir: join(process.cwd(), options.config.distDir),
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
