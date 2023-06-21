import { cosmiconfig } from 'cosmiconfig';
import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import multimatch from 'multimatch';
import filesize from 'filesize';
import { InItConfig } from 'in-it-shared-types';
import { parse } from 'bytes';
import pc from 'picocolors';

export async function sizeCheckBundles({ outDir }: { outDir: string }): Promise<void> {
  // get config
  const explorer = cosmiconfig('in-it');
  const result = await explorer.search();
  if (!result || result.isEmpty) {
    return;
  }
  const trackGlob = result.config.track ?? '**/*';
  const inItConfig = result.config as InItConfig;

  // get with globy the relevant files
  const trackedFiles = await globby(trackGlob, {
    cwd: outDir,
  });
  // get the size of each file
  const fileSizes: Record<string, number> = {};
  await Promise.all(
    trackedFiles.map(async (file) => {
      const fileFullPath = path.join(outDir, file);
      const fileSize = (await fs.stat(fileFullPath)).size;
      fileSizes[file] = fileSize;
    }),
  );

  const errors: string[] = [];
  const matchedFiles = new Set<string>();

  // compare to hard coded limits
  inItConfig.limits?.forEach((limit) => {
    Object.entries(limit).forEach(([limitedGlobby, limit]) => {
      const matches = multimatch(trackedFiles, limitedGlobby);
      matches
        .filter((file) => !matchedFiles.has(file))
        .forEach((file) => {
          matchedFiles.add(file);
          const fileSize = fileSizes[file];
          if (limit.maxSize && fileSize >= parse(limit.maxSize)) {
            errors.push(
              `File ${pc.bold(file)} size is ${pc.bold(
                filesize(fileSize) as string,
              )}, which is more than the limit of ${pc.bold(limit.maxSize)}`,
            );
          }
        });
    });
  });

  // TODO send result to github status check

  // if there are any relative limits, compare to the previous\master build
  // gather all errors and print them
  // if there are any errors, exit with error code
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(pc.red('Size check failed'));
    // throw new Error('Size check failed');
    process.exit(1);
  }
  // if there are no errors, exit with success code
}
