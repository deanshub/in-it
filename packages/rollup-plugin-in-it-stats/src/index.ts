import { NormalizedOutputOptions, OutputBundle, type RenderedModule } from 'rollup';
import { sendToServer } from './sendToServer';
import { writeToFile } from './writeToFile';
import type { RollupStatsPluginOptions, Stats } from 'in-it-shared-types';

type NotNullableObject<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

const rollupStatsDefaultPluginOptions: RollupStatsPluginOptions = {
  entry: 'main.js',
  output: 'stats.json',
  serverUrl: 'https://nissix.com/in-it/api/stats',
};

const hasCode = (
  module: [string, RenderedModule],
): module is [string, NotNullableObject<RenderedModule, 'code'>] => {
  return !!module[1].code;
};

export default function RollupStatsPlugin(
  rollupStatsGivvenPluginOptions: RollupStatsPluginOptions,
) {
  const statsPluginOptions = {
    ...rollupStatsDefaultPluginOptions,
    ...rollupStatsGivvenPluginOptions,
  };

  return {
    name: 'rollup-in-it-stats-plugin',
    generateBundle: async (options: NormalizedOutputOptions, outputBundle: OutputBundle) => {
      const stats: Stats = {
        appId: rollupStatsGivvenPluginOptions.appId, // TODO: use package.json name, path in repo, ...
        // version: ,
        // commit: ,
        entry: statsPluginOptions.entry,
        chunks: {},
        assets: {},
      };

      Object.entries(outputBundle).forEach(([fileName, chunk]) => {
        // Only include chunks
        if (chunk.type === 'chunk') {
          stats.chunks[chunk.name] = {
            size: chunk.code.length,
            modules: Object.entries(chunk.modules)
              .filter(hasCode)
              .map(([moduleId, module]) => {
                return {
                  id: moduleId,
                  size: module.code.length,
                  //   name: module.name,
                  name: fileName,
                  rendered: module.renderedExports,
                  //   imported: module.importedIds,
                  //   dependedOn: module.dependentIds,
                };
              }),
          };
        }
        //   else {
        //     // Add assets
        //     stats.assets[fileName] = {
        //       size: chunk.code.length,
        //     };
        //   }
      });

      const [sendToServerResult, writeToFileResult] = await Promise.allSettled([
        // send stats to server
        sendToServer(stats, statsPluginOptions.serverUrl),
        // Write stats to a file
        writeToFile(stats, statsPluginOptions, options),
      ]);

      if (sendToServerResult.status === 'rejected') {
        console.error('Failed to send stats to server', sendToServerResult.reason);
      }
      if (writeToFileResult.status === 'rejected') {
        console.error('Failed to write stats to file', writeToFileResult.reason);
      }
    },
  };
}
