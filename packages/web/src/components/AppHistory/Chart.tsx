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
    for (const build of builds) {
      if (compilations[build.compilation] === undefined) {
        compilations[build.compilation] = series.length;
        series[compilations[build.compilation]] = {
          id: build.compilation,
          data: [],
        };
      }
      series[compilations[build.compilation]].data.push({
        x: build.createdAt,
        y: build.parsedSize,
        id: build._id,
      });
    }
    return series;
  }, [builds]);
  return (
    <div className="h-64">
      <LineChart data={data} />
    </div>
  );
}
