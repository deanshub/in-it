import fs from 'fs-extra';
import path from 'path';
import pc from 'picocolors';
import type { NormalizedOutputOptions } from 'rollup';
import type { RollupStatsPluginOptions, Stats } from 'in-it-shared-types';

export async function writeToFile(
  stats: Stats,
  statsPluginOptions: RollupStatsPluginOptions,
  options: NormalizedOutputOptions,
): Promise<null | string> {
  if (statsPluginOptions.output) {
    const statsFilePath = path.join(process.cwd(), options?.dir ?? '', statsPluginOptions.output);
    await fs.ensureDir(path.dirname(statsFilePath));
    await fs.writeJSON(statsFilePath, stats, { spaces: 2 });

    console.log(
      `Rollup In-It Plugin: ${pc.green(
        `Wrote stats to ${pc.underline(path.relative(process.cwd(), statsFilePath))}`,
      )}`,
    );

    return statsFilePath;
  }
  return null;
}
