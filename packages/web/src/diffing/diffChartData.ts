import { hasBigEnoughSize } from './hasBigEnoughSize';
import { findMatchingPartWithChangedName } from './findMatchingPartWithChangedName';
import type { BundleStatsReport } from 'in-it-shared-types';

const hashRegex = new RegExp('\\-[a-z0-9]{16}\\.');
const concatenedModulesRegex = new RegExp(' \\+ \\d+ modules \\(concatenated\\)$');

export function diffChartData(
  baseChartData: undefined | BundleStatsReport,
  targetChartData: BundleStatsReport,
): BundleStatsReport {
  if (!baseChartData) {
    return targetChartData;
  }
  const chartData: BundleStatsReport = [];
  // iterate over targetChartData, find matching parts in baseChartData, and diff them in sizes
  targetChartData.forEach((targetPart) => {
    // TODO: use a map for faster lookup
    let basePart = baseChartData.find((part) => {
      return (
        // @ts-expect-error-next-line
        !part.checked &&
        part.label.replace(hashRegex, '').replace(concatenedModulesRegex, '') ===
          targetPart.label.replace(hashRegex, '').replace(concatenedModulesRegex, '')
      );
    });
    const part = { ...targetPart };
    let renamed = false;
    if (!basePart) {
      basePart = findMatchingPartWithChangedName(targetPart, baseChartData);
      if (basePart) {
        renamed = true;
      }
    }
    if (basePart) {
      // @ts-expect-error-next-line
      basePart.checked = true;
      part.statSize -= basePart.statSize;
      part.parsedSize -= basePart.parsedSize;
      part.gzipSize -= basePart.gzipSize;

      part.label = `${part.statSize > 0 ? '➕' : '➖'} ${
        renamed ? `${basePart.label}→${targetPart.label}` : targetPart.label
      }`;
      if (targetPart.groups) {
        part.groups = diffChartData(basePart.groups, targetPart.groups);
      }
      // @ts-expect-error-next-line
      targetPart.checked = true;
    } else {
      part.label = `🆕 ${targetPart.label}`;
    }

    if (hasBigEnoughSize(part)) {
      chartData.push(part);
    }
  });

  // add parts from baseChartData that are not in targetChartData
  baseChartData.forEach((basePart) => {
    // @ts-expect-error-next-line
    if (!basePart.checked) {
      chartData.push({
        ...basePart,
        label: `❌ ${basePart.label}`,
        parsedSize: -basePart.parsedSize,
        gzipSize: -basePart.gzipSize,
        statSize: -basePart.statSize,
      });
    }
  });

  return chartData;
}
