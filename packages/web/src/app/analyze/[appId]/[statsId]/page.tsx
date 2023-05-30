import { BundleAnalyzer } from '@/components/BundleAnalyzer/BundleAnalyzer';
import { Stats } from '@/db/models';
import Mongoose from 'mongoose';

async function getStats(appId: string, statsId: string) {
  const stats = await Stats.findById(new Mongoose.Types.ObjectId(statsId));
  return stats;
}

interface AppAnalyzeProps {
  params: {
    appId: string;
    statsId: string;
  };
}
export default async function AppAnalyze({ params: { appId, statsId } }: AppAnalyzeProps) {
  const stats = await getStats(appId, statsId);

  return (
    <div className="flex flex-col gap-2">
      <BundleAnalyzer statsUrl={stats?.compilationStatsUrl} appId={appId} />
    </div>
  );
}
