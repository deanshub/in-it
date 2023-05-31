import dbConnect from '@/db/dbConnect';
// import { getServerSession } from 'next-auth';
// import { nextAuthOptions } from './auth';
import { App, Stats } from '@/db/models';

export interface BuildItemType {
  _id: string;
  version: string;
  createdAt: Date;
  statSize: number;
  gzipSize: number;
  parsedSize: number;
  compilationStatsUrl: string;
  compilation: string;
  commitHash?: string;
}

export interface AppBuilds {
  builds: BuildItemType[];
  count: number;
  repository?: string;
}

export async function getAppBuilds(
  appId: string,
  { limit, offset }: { limit: number; offset: number },
): Promise<AppBuilds> {
  await dbConnect();

  //   upsert the user?
  //   const session = await getServerSession(nextAuthOptions);

  const [app, appBuilds, count] = await Promise.all([
    App.findById(appId),
    Stats.find({ appId, environment: 'ci', branch: 'master' }, null, {
      limit,
      offset,
      sort: { createdAt: -1 },
    }),
    Stats.countDocuments({ appId, environment: 'ci', branch: 'master' }),
  ]);

  const builds = appBuilds.map((build) => ({
    _id: build._id.toString(),
    version: build.generatingToolVersion,
    createdAt: build.createdAt,
    statSize: build.statSize,
    gzipSize: build.gzipSize,
    parsedSize: build.parsedSize,
    compilationStatsUrl: build.compilationStatsUrl,
    compilation: build.compilation,
    commitHash: build.commitHash,
  }));
  return { builds, count, repository: app?.repository };
}
