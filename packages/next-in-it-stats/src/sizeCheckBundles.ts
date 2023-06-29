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
  const { serverUrl, outDir, buildId, provider, repository, packagePath, name, packageName, branch, commitHash } =
    options;

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

  const formData = new FormData();
  const defaultBranch = await getDefaultBranch();

  setFormData(formData, 'environment', isCI ? 'ci' : 'local');
  setFormData(formData, 'defaultBranch', defaultBranch);
  setFormData(formData, 'branch', branch);
  setFormData(formData, 'commitHash', commitHash);
  setFormData(formData, 'inItConfig', JSON.stringify(inItConfig));
  setFormData(formData, 'buildId', buildId);
  setFormData(formData, 'provider', provider);
  setFormData(formData, 'repository', repository);
  setFormData(formData, 'packagePath', packagePath);
  setFormData(formData, 'name', name);
  setFormData(formData, 'packageName', packageName);
  setFormData(formData, 'trackedFiles', JSON.stringify(trackedFiles));
  setFormData(formData, 'fileSizes', JSON.stringify(fileSizes));

  // @ts-ignore-next-line
  const response = await fetch(`${serverUrl.toString()}/bundle-size-check`, {
    method: 'POST',
    body: formData,
  });

  if (response.status !== 200) {
    console.error(await response.text());
    console.error(pc.red('Error: Size check failed'));
    // throw new Error('Size check failed');
    process.exit(1);
  }
  // if there are no errors, exit with success code
}

function setFormData(formData: FormData, key: string, value: undefined | string) {
  if (value) {
    formData.append(key, value);
  }
}
