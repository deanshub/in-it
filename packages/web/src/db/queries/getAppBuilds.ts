import dbConnect from '@/db/dbConnect';
// import { getServerSession } from 'next-auth';
// import { nextAuthOptions } from './auth';
import { App, Stats } from '@/db/models';

export interface BuildItemType {
  _id: string;
  version: string;
  commitHash?: string;
  createdAt: Date;
  compilations: {
    id: string;
    name: string
    createdAt: Date;
    statSize: number;
    gzipSize: number;
    parsedSize: number;
    compilationStatsUrl: string;
  }[]
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

  const [app, buildAggregation] = await Promise.all([
    App.findById(appId),
    Stats.aggregate([
      {
        $match: {
          appId,
          environment: 'ci',
          branch: 'master',
        },
      },
      {
        $group: {
          _id: '$buildId',
          compilations: {
            $push: {
              id: '$_id',
              name: '$compilation',
              createdAt: '$createdAt',
              statSize: '$statSize',
              gzipSize: '$gzipSize',
              parsedSize: '$parsedSize',
              compilationStatsUrl: '$compilationStatsUrl',
            },
          },
          createdAt: {
            $max: '$createdAt',
          },
          version: { $first: '$version'},
          commitHash: { $first: '$commitHash'},
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $facet: {
          metadata: [
            {
              $count: 'total',
            },
          ],
          data: [
            {
              $skip: offset,
            },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]),
  ]);

  const count = buildAggregation[0]?.metadata[0]?.total ?? 0;
  const builds = buildAggregation[0]?.data ?? [] as BuildItemType[];

  return { builds, count, repository: app?.repository };
}
