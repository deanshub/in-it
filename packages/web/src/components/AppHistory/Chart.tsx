import { LineChart } from '../Charts/LineChart';
import { useMemo } from 'react';
import type { BuildItemType } from '@/utils/getAppBuilds';

interface ChartProps {
  builds: BuildItemType[];
}
export function Chart({ builds }: ChartProps) {
  const data = useMemo(
    () => [
      {
        id: 'builds',
        data: builds.map((build) => ({
          x: build.createdAt,
          y: build.parsedSize,
        })),
      },
    ],
    [builds],
  );
  return (
    <div className="h-64">
      <LineChart data={data} />
    </div>
  );
}
