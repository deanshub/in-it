import { BasicPackageData } from 'in-it-shared-types';
import App from '../db/models/App';

type AppIdOptions = Partial<BasicPackageData>;

export async function getAppId({
  provider,
  repository,
  packagePath,
  name,
  packageName,
}: AppIdOptions): Promise<null | string> {
  if (provider && repository) {
    // query db for appId using provider, repository
    // find the best match using packagePath, name, packageName
    const apps = await App.find({
      provider,
      repository,
    });

    if (apps.length === 1) {
      return apps[0]._id.toString();
    }
    if (apps.length > 1) {
      let appsWithPackagePath = apps.filter((a) => a.packagePath === packagePath);
      if (appsWithPackagePath.length === 1) {
        return appsWithPackagePath[0]._id.toString();
      } else if (appsWithPackagePath.length === 0) {
        appsWithPackagePath = apps;
      }

      let appsWithName = appsWithPackagePath.filter((a) => a.name === name);
      if (appsWithName.length === 1) {
        return appsWithName[0]._id.toString();
      } else if (appsWithName.length === 0) {
        appsWithName = appsWithPackagePath;
      }

      let appsWithPackageName = appsWithName.filter((a) => a.packageName === packageName);
      if (appsWithPackageName.length === 1) {
        return appsWithPackageName[0]._id.toString();
      } else if (appsWithPackageName.length === 0) {
        appsWithPackageName = appsWithName;
      }

      if (appsWithPackageName.length === 1) {
        return appsWithPackageName[0]._id.toString();
      }
    }
  }

  return null;
}
