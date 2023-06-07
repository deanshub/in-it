interface BundleAnalyzerProps {
  appId: string;
  statsUrl?: string;
  baseStatsUrl?: string;
}

export function BundleAnalyzer({ appId, statsUrl, baseStatsUrl }: BundleAnalyzerProps) {
  return (
    <div className="flex flex-col gap-2">
      <iframe
        src={`/bundle-analyzer/view?appId=${appId}&statsUrl=${statsUrl}${
          baseStatsUrl ? `&baseStatsUrl=${baseStatsUrl}` : ''
        }`}
        className="w-full h-[77vh] bg-white"
      />
    </div>
  );
}
