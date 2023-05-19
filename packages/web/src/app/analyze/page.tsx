import fs from 'fs-extra';
import path from 'path';
import { BundleAnalyzer } from '@/components/BundleAnalyzer/BundleAnalyzer';

async function getRuntimes() {
  const inItStatsPath = path.join(process.cwd(), '.next/in-it-stats');
  const files = await fs.readdir(inItStatsPath);
  const runtimes = files.map((file) => {
    return path.basename(file, '.json');
  });
  return runtimes;
}

export default async function AppAnalyze() {
  const runtimes = await getRuntimes();
  const options = runtimes.map((runtime) => ({
    value: runtime,
    label: `${runtime.charAt(0).toUpperCase()}${runtime.slice(1)}`,
  }));

  return (
    <div className="flex flex-col gap-2">
      <BundleAnalyzer options={options} />
    </div>
  );
}
