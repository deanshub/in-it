import type { BundleStatsReport } from 'in-it-shared-types';

const MINIMUM_SIMILARITY_SCORE = 0.9;

export function findMatchingPartWithChangedName(
  targetPart: BundleStatsReport[0],
  baseChartData: BundleStatsReport,
): BundleStatsReport[0] | undefined {
  // if the labels in the first and second group are the same (90% or above), we can assume that the part was renamed
  const baseScores = baseChartData.map((basePart) => {
    if (
      // @ts-expect-error-next-line
      !basePart.checked
    ) {
      // compare the labels of the first and second group
      const firstGroupScore = getSimilarityScore(targetPart.groups, basePart.groups);
      console.log({ firstGroupScore });
      if (firstGroupScore < MINIMUM_SIMILARITY_SCORE) {
        return 0;
      }
      const secondGroupScore = getSimilarityScore(
        targetPart.groups?.flatMap((group) => group.groups ?? []),
        basePart.groups?.flatMap((group) => group.groups ?? []),
      );
      console.log({ secondGroupScore });

      return Math.min(firstGroupScore, secondGroupScore);
    }
    return 0;
  });

  // get the index of the highest score
  const highestScoreIndex = baseScores.reduce((highestIndex, score, index, scores) => {
    if (score > scores[highestIndex]) {
      return index;
    }
    return highestIndex;
  }, 0 as number);

  if (baseScores[highestScoreIndex] > MINIMUM_SIMILARITY_SCORE) {
    return baseChartData[highestScoreIndex];
  }

  return undefined;
}

function getSimilarityScore(
  groups1: BundleStatsReport | undefined,
  groups2: BundleStatsReport | undefined,
): number {
  if (!groups1 || !groups2) {
    return 0;
  }
  const labels1 = groups1.map((group) => group.label);
  const labels2 = groups2.map((group) => group.label);

  const commonKeys = labels1.filter((key) => labels2.includes(key));

  const commonLabels1 = groups1.filter((group) => commonKeys.includes(group.label));
  const commonLabels2 = groups2.filter((group) => commonKeys.includes(group.label));

  const score =
    Math.min(commonLabels1.length, commonLabels2.length) /
    Math.max(commonLabels1.length, commonLabels2.length);

  return isNaN(score) ? 0 : score;
}
