import type { BundleStatsReport } from 'in-it-shared-types';

const MIN_SIZE = 10;
export function hasBigEnoughSize(part: BundleStatsReport[number]): boolean {
  return (
    Math.abs(part.statSize) > MIN_SIZE &&
    Math.abs(part.parsedSize) > MIN_SIZE &&
    Math.abs(part.gzipSize) > MIN_SIZE
  );
}
