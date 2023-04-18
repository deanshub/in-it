import { NormalizedOutputOptions, OutputBundle, Plugin, type RenderedModule } from 'rollup';
import fs from 'fs-extra';
import path from 'path';
import type { RollupStatsPluginOptions, Stats } from 'shared-types';

type NotNullableObject<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

const hasCode = (
  module: [string, RenderedModule],
): module is [string, NotNullableObject<RenderedModule, 'code'>] => {
  return !!module[1].code;
};

export default class RollupStatsPlugin implements Plugin {
  public readonly statsPluginOptions: RollupStatsPluginOptions;
  public readonly name: string;

  constructor(options: RollupStatsPluginOptions = { entry: 'main.js', output: 'stats.json' }) {
    this.name = 'rollup-stats-plugin';
    this.statsPluginOptions = options;
  }

  public generateBundle(options: NormalizedOutputOptions, outputBundle: OutputBundle): void {
    const stats: Stats = {
      entry: this.statsPluginOptions?.entry ?? 'main.js',
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

    // Write stats to a file
    const statsFilePath = path.join(
      process.cwd(),
      options.dir ?? '',
      this.statsPluginOptions?.output ?? 'stats.json',
    );
    fs.writeJSONSync(statsFilePath, stats, { spaces: 2 });
  }
}