interface BundleAnalyzerProps {
  statsUrl?: string;
}

export function BundleAnalyzer({ statsUrl }: BundleAnalyzerProps) {
  return (
    <div className="flex flex-col gap-2">
      <iframe
        src={`/bundle-analyzer/view?statsUrl=${statsUrl}`}
        className="w-full h-[77vh] bg-white"
      />
    </div>
  );
}
