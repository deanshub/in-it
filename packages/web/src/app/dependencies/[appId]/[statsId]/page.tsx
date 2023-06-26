import { getStats } from '@/utils/getStats';
import { Graph } from 'nissix-graph';
import type { Dependencies } from 'nissix-graph/types/basics';
import type { BundleStatsReport } from 'in-it-shared-types';

async function getDependencies(compilationStatsUrl: string) {
  const bundleStatsReportResponse = await fetch(compilationStatsUrl, { cache: 'no-store' });
  const bundleStatsReport: BundleStatsReport = await bundleStatsReportResponse.json();
  const dependencies = bundleStatsReportToDependencies(bundleStatsReport);

  return Object.fromEntries(
    Array.from(dependencies.entries()).map(([chunkName, chunk]) => [
      chunkName,
      {
        ...chunk,
        chunkDependencies: Array.from(chunk.chunkDependencies),
      },
    ]),
  );
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
      <Graph data={dependencies} />
    </div>
  );
}

function bundleStatsReportToDependencies(
  bundleStatsReport: BundleStatsReport,
  origin?: string,
  dependencies: Map<string, Dependencies> = new Map<string, Dependencies>(),
) {
  bundleStatsReport.forEach((bundle) => {
    const chunkDependencies = new Set<string>();
    const name = origin ?? normalizeChunkName(bundle.path ?? bundle.label);
    bundle.groups?.forEach((group) => {
      const subChunkName = normalizeChunkName(group.path ?? group.label);
      if (subChunkName && subChunkName !== name && subChunkName !== SOURCE_CODE_NAME) {
        chunkDependencies.add(subChunkName);
      }
      bundleStatsReportToDependencies([group], subChunkName || name, dependencies);
    });

    if (name) {
      if (!dependencies.has(name)) {
        dependencies.set(name, {
          chunkDependencies,
          parsedSize: bundle.parsedSize,
          gzipSize: bundle.gzipSize,
          statSize: bundle.statSize,
        });
      } else {
        const originalBundleDependencies = dependencies.get(name)!;
        dependencies.set(name, {
          ...originalBundleDependencies,
          chunkDependencies: new Set([
            ...originalBundleDependencies.chunkDependencies,
            ...chunkDependencies,
          ]),
        });
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
