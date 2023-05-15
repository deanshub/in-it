import { join } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import type { NextStatsPluginOptions } from 'in-it-shared-types';
import type { NextConfig } from 'next';

// TODO: use options (appId, serverUrl)
function nextInItStats({ outDir = './in-it-stats' }: Partial<NextStatsPluginOptions> = {}) {
  return (nextConfig: NextConfig = {}) => {
    const nextConfigWithInItStats: NextConfig = {
      ...nextConfig,
      webpack(config, options) {
        let reportFilename;
        if (outDir.startsWith('.')) {
          if (!options.nextRuntime) {
            reportFilename = join(outDir, `client.json`);
          } else {
            reportFilename = join(
              options.nextRuntime === 'nodejs' ? '../../' : '../',
              outDir,
              `${options.nextRuntime}.json`,
            );
          }
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
