import type { PipelineStage } from 'mongoose';

interface GetStatsQuery {
  appId: string;
  branch: string | { $in: string[] };
  environment: string;
  userId?: string;
}
export function getStatsQuery(
  { appId, branch, environment, userId }: GetStatsQuery,
  { limit, offset }: { limit: number; offset: number },
): PipelineStage[] {
  return [
    {
      $match: {
        appId,
        environment,
        branch,
        userId,
      },
    },
    {
      $setWindowFields: {
        partitionBy: '$compilation',
        sortBy: {
          createdAt: -1,
        },
        output: {
          previousCompilationId: {
            $shift: {
              output: '$_id',
              by: 1,
              default: undefined,
            },
          },
        },
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
            previousCompilationId: '$previousCompilationId',
          },
        },
        createdAt: {
          $max: '$createdAt',
        },
        version: { $first: '$version' },
        commitHash: { $first: '$commitHash' },
        branch: { $first: '$branch' },
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
  ];
}
