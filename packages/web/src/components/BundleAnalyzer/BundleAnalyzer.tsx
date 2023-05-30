interface BundleAnalyzerProps {
  statsUrl?: string;
  appId: string;
}

export function BundleAnalyzer({ statsUrl, appId }: BundleAnalyzerProps) {
  return (
    <div className="flex flex-col gap-2">
      <iframe
        src={`/bundle-analyzer/view?appId=${appId}&statsUrl=${statsUrl}`}
        className="w-full h-[77vh] bg-white"
      />
    </div>
  );
}
