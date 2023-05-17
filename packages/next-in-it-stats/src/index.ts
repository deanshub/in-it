import { join } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import InItStatsWebpackPlugin from './InItStatsWebpackPlugin';
import type { NextStatsPluginOptions } from 'in-it-shared-types';
import type { NextConfig } from 'next';

// TODO: use options (appId)
function nextInItStats({
  outDir = './in-it-stats',
  serverUrl = 'https://nissix.com/api/stats',
}: Partial<NextStatsPluginOptions> = {}) {
  return (nextConfig: NextConfig = {}) => {
    const nextConfigWithInItStats: NextConfig = {
      ...nextConfig,
      webpack(config, options) {
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

        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'json',
            // openAnalyzer: true,
            // generateStatsFile: true,
            // statsFilename: `${options.nextRuntime ?? 'client'}.json`,
            reportFilename,
            // reportFilename: !options.nextRuntime
            //   ? `./analyze/client.html`
            //   : `../${options.nextRuntime === 'nodejs' ? '../' : ''}analyze/${
            //       options.nextRuntime
            //     }.html`,
            logLevel: 'silent',
          }),
          new InItStatsWebpackPlugin({
            serverUrl,
            reportFilename,
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
