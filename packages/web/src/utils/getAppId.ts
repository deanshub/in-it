import { BasicPackageData } from 'in-it-shared-types';

export async function getAppId({
  provider,
  repository,
  packagePath,
  name,
  packageName,
}: Partial<BasicPackageData>): Promise<null | string> {
  if (provider && repository) {
    // query db for appId using provider, repository
    // find the best match using packagePath, name, packageName
  }

  return null;
}
