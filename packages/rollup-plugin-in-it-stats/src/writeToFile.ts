import { NormalizedOutputOptions } from 'rollup';
import fs from 'fs-extra';
import path from 'path';
import { RollupStatsPluginOptions, Stats } from 'in-it-shared-types';

export async function writeToFile(
  stats: Stats,
  statsPluginOptions: RollupStatsPluginOptions,
  options: NormalizedOutputOptions,
): Promise<void> {
  const statsFilePath = path.join(
    process.cwd(),
    options?.dir ?? '',
    statsPluginOptions?.output ?? 'stats.json',
  );
  await fs.ensureDir(path.dirname(statsFilePath));
  await fs.writeJSON(statsFilePath, stats, { spaces: 2 });
}
