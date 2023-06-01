import { getAppBuilds } from '@/db/queries';
import { Chart } from './Chart';
import { BuildsList } from './BuildsList';
import { PAGE_SIZE } from '@/utils/paging';

interface AppHistoryProps {
  appId: string;
  page: number;
}
export async function AppHistory({ appId, page }: AppHistoryProps) {
  const { builds, count, repository } = await getAppBuilds(appId, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  return (
    <div className="flex flex-1 flex-col">
      <Chart builds={builds} />
      <BuildsList appId={appId} builds={builds} page={page} count={count} repository={repository} />
    </div>
  );
}
