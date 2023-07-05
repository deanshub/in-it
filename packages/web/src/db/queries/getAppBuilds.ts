import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import { App, Stats } from '@/db/models';
import { getStatsQuery } from './getStatsQuery';
import { defaultBranches } from '@/utils/defaultBranches';

export interface BuildItemType {
  _id: string;
  version: string;
  commitHash?: string;
  createdAt: Date;
  branch?: string;
  compilations: {
    id: string;
    name: string;
    createdAt: string;
    statSize: number;
    gzipSize: number;
    parsedSize: number;
    compilationStatsUrl: string;
    previousCompilationId?: string;
  }[];
}

export interface AppBuilds {
  builds: BuildItemType[];
  count: number;
  repository?: string;
  branches: string[];
  defaultBranchLatestBuild?: BuildItemType;
}

export async function getAppBuilds(
  appId: string,
  branch: string,
  environment: string,
  { limit, offset }: { limit: number; offset: number },
): Promise<AppBuilds> {
  const session = await getServerSession(nextAuthOptions);

  const userId = session?.user?.dbUserId;

  //   upsert the user?

  const [app, branches, buildAggregation, defaultBranchBuildAggregation] = await Promise.all([
    App.findById(appId),
    // get distinct branches in stats
    Stats.distinct('branch', {
      appId,
      environment,
    }),
    environment === 'local' && !userId
      ? []
      : Stats.aggregate(
          getStatsQuery(
            {
              appId,
              branch,
              environment,
              userId: environment === 'local' ? userId : undefined,
            },
            { limit, offset },
          ),
        ),
    defaultBranches.includes(branch)
      ? undefined
      : Stats.aggregate(
          getStatsQuery(
            { appId, branch: { $in: defaultBranches }, environment: 'ci' },
            { limit: 1, offset: 0 },
          ),
        ),
  ]);

  const count = buildAggregation[0]?.metadata[0]?.total ?? 0;
  const builds = buildAggregation[0]?.data ?? [];

  return {
    builds,
    branches,
    count,
    repository: app?.repository,
    defaultBranchLatestBuild: defaultBranchBuildAggregation?.[0]?.data[0],
  };
}
