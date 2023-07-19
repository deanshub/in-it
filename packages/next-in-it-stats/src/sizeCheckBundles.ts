import fetch from 'node-fetch';
import { cosmiconfig } from 'cosmiconfig';
import globby from 'globby';
import fs from 'fs-extra';
import path from 'path';
import { InItConfig } from 'in-it-shared-types';
import pc from 'picocolors';
import { getDefaultBranch } from './git.js';
import isCI from 'is-ci';

interface SizeCheckBundlesOptions {
  serverUrl: URL;
  outDir: string;
  buildId: string;
  provider?: string;
  repository?: string;
  packagePath: string;
  name?: string;
  packageName: string;
  branch?: string;
  commitHash?: string;
}
export async function sizeCheckBundles(options: SizeCheckBundlesOptions): Promise<void> {
  const {
    serverUrl,
    outDir,
    buildId,
    provider,
    repository,
    packagePath,
    name,
    packageName,
    branch,
    commitHash,
  } = options;

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

  const defaultBranch = await getDefaultBranch();
  const body = {
    environment: isCI ? 'ci' : 'local',
    defaultBranch,
    branch,
    commitHash,
    inItConfig,
    buildId,
    provider,
    repository,
    packagePath,
    name,
    packageName,
    trackedFiles,
    fileSizes,
  };

  // @ts-ignore-next-line
  const response = await fetch(`${serverUrl.toString()}/bundle-size-check`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  const { status } = response;

  if (status !== 200) {
    console.error(pc.red(`status: ${status}`));
    const { message } = await response.json();
    console.error(pc.red(`body: ${message}`));

    if (status === 406) {
      console.error(pc.red('Error: Size check failed'));
    }

    console.error(pc.red('Error: Failed to send bundle size check to in-it server'));
    // process.exit(1);
  }
}
