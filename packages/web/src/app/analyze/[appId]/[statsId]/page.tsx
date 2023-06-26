import { BundleAnalyzer } from '@/components/BundleAnalyzer/BundleAnalyzer';
import { getStats } from '@/utils/getStats';

interface AppAnalyzeProps {
  params: {
    appId: string;
    statsId: string;
  };
}
export default async function AppAnalyze({ params: { appId, statsId } }: AppAnalyzeProps) {
  const [targetStatsId, baseStatsId] = statsId.split('-');
  const [targetStats, baseStats] = await Promise.all([
    getStats(appId, targetStatsId),
    getStats(appId, baseStatsId),
  ]);

  return (
    <div className="flex flex-col gap-2">
      <BundleAnalyzer
        statsUrl={targetStats?.compilationStatsUrl}
        baseStatsUrl={baseStats?.compilationStatsUrl}
        appId={appId}
      />
    </div>
  );
}
