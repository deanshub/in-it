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
