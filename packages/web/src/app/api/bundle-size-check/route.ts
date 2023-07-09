import { getBundleSizeValidation } from '@/db/queries';
import type {
  BundleSizeValidationDocument,
  InItConfig,
  SourceCodeProvider,
} from 'in-it-shared-types';
import { NextResponse } from 'next/server';
import multimatch from 'multimatch';
import { parse } from 'bytes';
import pc from 'picocolors';
import filesize from 'filesize';
import dbConnect from '@/db/dbConnect';
import { getAppId } from '@/utils/getAppId';
import { createBundleSizeValidation } from '@/db/helpers/createBundleSizeValidation';
import { reportBundleSizeStatusCheck } from '@/utils/github';

export async function POST(request: Request) {
  const body = await request.json();

  const {
    branch,
    defaultBranch,
    inItConfig,
    provider,
    repository,
    packagePath,
    packageName,
    commitHash,
    buildId,
    name,
    environment,
    trackedFiles,
    fileSizes,
  } = body;
  await dbConnect();
  const appId = await getAppId({
    provider: provider as undefined | SourceCodeProvider,
    repository,
    packagePath,
    name,
    packageName,
  });

  if (!appId) {
    return new NextResponse(`App not found`, {
      status: 404,
    });
  }

  const errors: string[] = [];
  const trackedFilesStatus: BundleSizeValidationDocument['trackedFiles'] = {};
  const matchedFiles = new Set<string>();

  const statsFromDefaultBranch = await getBundleSizeValidation(
    {
      appId,
      status: 'passed',
    },
    { limit: 1, offset: 0 },
  );

  // compare to hard coded limits
  (inItConfig as InItConfig).limits?.forEach((limit) => {
    Object.entries(limit).forEach(([limitedGlobby, limit]) => {
      const matches = multimatch(trackedFiles, limitedGlobby);
      matches
        .filter((file) => !matchedFiles.has(file))
        .forEach((file) => {
          matchedFiles.add(file);
          const fileSize = fileSizes[file];
          if (limit.maxSize && fileSize >= parse(limit.maxSize)) {
            errors.push(
              `File ${pc.bold(file)} size is ${pc.bold(
                filesize(fileSize) as string,
              )}, which is more than the limit of ${pc.bold(limit.maxSize)}`,
            );
            trackedFilesStatus[file] = {
              size: fileSize,
              status: 'failed',
              reason: `exceeds limit of ${limit.maxSize}`,
            };
          } else {
            // check percentage increase
            if (statsFromDefaultBranch.length === 1) {
              const defaultBranchTrackedFiles = statsFromDefaultBranch[0].trackedFiles;
              const defaultBranchFileSize = defaultBranchTrackedFiles[file]?.size;
              if (defaultBranchFileSize) {
                const percentageIncrease =
                  ((fileSize - defaultBranchFileSize) / defaultBranchFileSize) * 100;
                if (limit.maxDifference && percentageIncrease > parseFloat(limit.maxDifference)) {
                  errors.push(
                    `File ${pc.bold(file)} size increased by ${pc.bold(
                      percentageIncrease.toFixed(2),
                    )}%, which is more than the limit of ${pc.bold(limit.maxDifference)}`,
                  );
                  trackedFilesStatus[file] = {
                    size: fileSize,
                    status: 'failed',
                    reason: `exceeds limit of ${limit.maxDifference} percentage increase`,
                  };
                }
              }
            } else {
              trackedFilesStatus[file] = {
                size: fileSize,
                status: 'passed',
              };
            }
          }
        });
    });
  });

  const haveErrors = Object.keys(errors).length > 0;
  let responseStatus;

  if (defaultBranch === branch) {
    responseStatus = haveErrors ? 406 : 200;
    if (environment === 'ci') {
      createBundleSizeValidation({
        buildId,
        appId,
        commitHash,
        status: errors.length ? 'failed' : 'passed',
        trackedFiles: trackedFilesStatus,
      });
    }
  } else {
    responseStatus = 200;
  }

  let checkStatusMessage = '';
  if (environment === 'ci') {
    // create github check
    checkStatusMessage = await reportBundleSizeStatusCheck({
      packageName,
      commitHash,
      repository,
      status: 'completed',
      conclusion: errors.length ? 'failure' : 'success',
    });
  }

  return new NextResponse(`${haveErrors ? errors.join('\n') : ''} \n\n ${checkStatusMessage}`, {
    status: responseStatus,
  });
}
