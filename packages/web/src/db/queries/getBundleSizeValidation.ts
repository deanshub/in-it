import { BundleSizeValidation } from '../models';

interface BundleSizeValidationFilter {
  appId?: string;
  buildId?: string;
  commitHash?: string;
  status?: string;
}

export function getBundleSizeValidation(
  { appId, status }: BundleSizeValidationFilter,
  { limit, offset }: { limit: number; offset: number },
) {
  console.log('getBundleSizeValidation', {
    appId,
    // buildId,
    // commitHash,
    status,
  });
  return BundleSizeValidation.find({
    appId,
    // buildId,
    // commitHash,
    status,
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
}
