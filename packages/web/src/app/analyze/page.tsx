import { BundleAnalyzer } from '@/components/BundleAnalyzer/BundleAnalyzer';
import { useMemo } from 'react';

export default function AppAnalyze() {
  const options = useMemo(
    () => [
      {
        value: 'client',
        label: 'Browser',
      },
      {
        value: 'nodejs',
        label: 'Node.js',
      },
      { value: 'edge', label: 'Edge' },
    ],
    [],
  );
  return (
    <div className="flex flex-col gap-2">
      <BundleAnalyzer options={options} />
    </div>
  );
}
