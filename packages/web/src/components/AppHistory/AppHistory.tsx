import { getAppBuilds } from '@/db/queries';
import { Chart } from './Chart';
import { BuildsList } from './BuildsList';
import { PAGE_SIZE } from '@/utils/paging';
import { AvailableBranches } from './AvailableBranches';

interface AppHistoryProps {
  appId: string;
  page: number;
  branch: string;
}
export async function AppHistory({ appId, page, branch }: AppHistoryProps) {
  const { builds, count, repository, branches } = await getAppBuilds(appId, branch, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  return (
    <div className="flex flex-1 flex-col">
      <Chart builds={builds} />
      <AvailableBranches branches={branches} currentBranch={branch} appId={appId} />
      <BuildsList appId={appId} builds={builds} page={page} count={count} repository={repository} />
    </div>
  );
}
