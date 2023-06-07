import dbConnect from '@/db/dbConnect';
// import { getServerSession } from 'next-auth';
// import { nextAuthOptions } from './auth';
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
  { limit, offset }: { limit: number; offset: number },
): Promise<AppBuilds> {
  await dbConnect();

  //   upsert the user?
  //   const session = await getServerSession(nextAuthOptions);

  const [app, branches, buildAggregation, defaultBranchBuildAggregation] = await Promise.all([
    App.findById(appId),
    // get distinct branches in stats
    Stats.distinct('branch', {
      appId,
      environment: 'ci',
    }),
    Stats.aggregate(getStatsQuery(appId, branch, { limit, offset })),
    !defaultBranches.includes(branch)
      ? Stats.aggregate(getStatsQuery(appId, { $in: defaultBranches }, { limit: 1, offset: 0 }))
      : undefined,
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
