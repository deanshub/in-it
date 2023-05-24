import { BasicPackageData, CompilationSizes } from './entities';

type WithId<T> = T & { _id: string };
// created at build and selected from cache every build upsert asyncly every build
export type AppsDocument = WithId<BasicPackageData>;

// created (and updated) when user logges-in
export type UserDocument = WithId<{
  userNameInProvider: string; // githubUsername? (UK)
  provider: 'github'; // | 'gitlab' | 'bitbucket'; (UK)
  email: string;
  name?: string;
  avatarUrl?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}>;

// Created when user goes to a build\app url (asyncly create if not exists)
export interface AppUsersDocument {
  appId: string; // (FK)
  userId: string; // (FK)
}

// created when user pays, queried when a user goes to a build\app url
export type LicenseDocument = WithId<{
  appId: string; // (FK)
  payingUserId: string; // (FK)
  licenseType: 'free' | 'pro' | 'enterprise';
  startDate: Date;
  endDate: Date;
}>;

export type StatsDocument = WithId<
  BasicPackageData &
    CompilationSizes & {
      appId: string; // (FK)
      userId?: string; // (FK)
      version: string;
      buildId: string;
      createdAt: Date;
      envirmonet: 'local' | 'ci' | 'web';
      branch: string;
      compilationStatsUrl: string;
      compilation: string;
      generatingTool: string;
      generatingToolVersion: string;
    }
>;

export interface FileTrackingDocument {
  statsId: string; // (PK)
  createdAt: Date;
  trackedFiles: {
    [filePath: string]: {
      size: number;
      gzipSize: number;
    };
  };
}
