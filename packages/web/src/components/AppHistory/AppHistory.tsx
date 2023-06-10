import { getAppBuilds } from '@/db/queries';
import { Chart } from './Chart';
import { BuildsList } from './BuildsList';
import { PAGE_SIZE } from '@/utils/paging';
import { AvailableBranches } from './AvailableBranches';
import { AvailableEnvironments } from './AvailableEnvironments';

interface AppHistoryProps {
  appId: string;
  page: number;
  branch: string;
  environment: string;
}
export async function AppHistory({ appId, page, branch, environment }: AppHistoryProps) {
  const { builds, count, repository, branches, defaultBranchLatestBuild } = await getAppBuilds(
    appId,
    branch,
    environment,
    {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    },
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-end">
        <AvailableEnvironments
          environments={['ci', 'local', 'web']}
          currentEnvironment={environment}
          appId={appId}
          branch={branch}
        />
        <AvailableBranches
          branches={branches}
          currentBranch={branch}
          appId={appId}
          environment={environment}
        />
      </div>
      <Chart builds={builds} />
      <BuildsList
        appId={appId}
        builds={builds}
        page={page}
        count={count}
        repository={repository}
        defaultBranchLatestBuild={defaultBranchLatestBuild}
      />
    </div>
  );
}
