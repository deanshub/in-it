import { getStats } from '@/utils/getStats';
import type { BundleStatsReport } from 'in-it-shared-types';

async function getDependencies(compilationStatsUrl: string) {
  const bundleStatsReportResponse = await fetch(compilationStatsUrl, { cache: 'no-store' });
  const bundleStatsReport: BundleStatsReport = await bundleStatsReportResponse.json();
  const dependencies = bundleStatsReportToDependencies(bundleStatsReport);
  return dependencies;
}

interface AppAnalyzeProps {
  params: {
    appId: string;
    statsId: string;
  };
}

export default async function AppAnalyze({ params: { appId, statsId } }: AppAnalyzeProps) {
  const stats = await getStats(appId, statsId);
  if (!stats?.compilationStatsUrl) {
    throw new Error('Stats not found');
  }
  const dependencies = await getDependencies(stats.compilationStatsUrl);

  return (
    <div className="flex flex-col gap-2">
      {Array.from(dependencies.entries()).map(([chunkName, chunkDependencies]) => (
        <div key={chunkName} className="flex flex-col gap-2">
          <span>{chunkName}:</span>
          <ul className="flex flex-col gap-2 list-disc list-inside">
            {Array.from(chunkDependencies).map((chunkDependency) => (
              <li key={chunkDependency}>{chunkDependency}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function bundleStatsReportToDependencies(
  bundleStatsReport: BundleStatsReport,
  dependencies: Map<string, Set<string>> = new Map<string, Set<string>>(),
) {
  bundleStatsReport.forEach((bundle) => {
    const chunkDependencies = new Set<string>();
    const name = normalizeChunkName(bundle.label);
    bundle.groups?.forEach((group) => {
      const subChunkName = normalizeChunkName(group.label);
      if (subChunkName && subChunkName !== SOURCE_CODE_NAME) {
        chunkDependencies.add(subChunkName);
      }
      bundleStatsReportToDependencies([group], dependencies);
    });

    if (chunkDependencies.size > 0) {
      if (!dependencies.has(name)) {
        dependencies.set(name, chunkDependencies);
      } else {
        dependencies.set(name, new Set([...dependencies.get(name)!, ...chunkDependencies]));
      }
    }
  });
  return dependencies;
}

const NODE_MODULES_DIR = 'node_modules';
const SOURCE_CODE_NAME = 'SOURCE_CODE';
function normalizeChunkName(name: string): string {
  const index = name.lastIndexOf(NODE_MODULES_DIR);
  if (index === -1) {
    return SOURCE_CODE_NAME;
  }
  const moduleName = name.slice(index + NODE_MODULES_DIR.length + 1);
  const dirs = moduleName.split('/');
  if (moduleName.startsWith('@') && dirs.length > 2) {
    return `${dirs[0]}/${dirs[1]}`;
  }
  return dirs[0];
}
