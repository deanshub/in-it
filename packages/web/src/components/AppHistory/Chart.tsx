import { LineChart } from '../Charts/LineChart';
import { useMemo } from 'react';
import type { BuildItemType } from '@/db/queries';
import type { Serie } from '@nivo/line';

interface ChartProps {
  builds: BuildItemType[];
}
export function Chart({ builds }: ChartProps) {
  const data = useMemo(() => {
    const compilations: Record<string, number> = {};
    const series: Serie[] = [];
    for (const build of builds.slice().reverse()) {
      for (const compilation of build.compilations) {
        if (compilations[compilation.name] === undefined) {
          compilations[compilation.name] = series.length;
          series[compilations[compilation.name]] = {
            id: compilation.name,
            data: [],
          };
        }
        series[compilations[compilation.name]].data.push({
          x: build.createdAt,
          y: compilation.parsedSize,
          id: build._id,
          version: build.version,
        });
      }
    }
    return series;
  }, [builds]);
  return (
    <div className="h-64">
      <LineChart data={data} />
    </div>
  );
}
