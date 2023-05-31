import { getAppBuilds } from '@/db/queries';
import { Chart } from './Chart';
import { BuildsList } from './BuildsList';

interface AppHistoryProps {
  appId: string;
  page: number;
}
export async function AppHistory({ appId, page }: AppHistoryProps) {
  const { builds, count, repository } = await getAppBuilds(appId, {
    limit: 6,
    offset: (page - 1) * 6,
  });
  return (
    <div className="flex flex-1 flex-col">
      <Chart builds={builds} />
      <BuildsList builds={builds} count={count} repository={repository} />
    </div>
  );
}
