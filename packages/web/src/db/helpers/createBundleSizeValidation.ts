import type { BundleSizeValidationDocument } from 'in-it-shared-types';
import { BundleSizeValidation } from '../models';

// add BundleSizeValidation doc
export async function createBundleSizeValidation(
  options: BundleSizeValidationDocument,
): Promise<BundleSizeValidationDocument> {
  const bundleSizeValidation = new BundleSizeValidation(options);
  await bundleSizeValidation.save();

  return bundleSizeValidation;
}
