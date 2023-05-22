'use client';
import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}
interface BundleAnalyzerProps {
  options: Option[];
}

export function BundleAnalyzer({ options }: BundleAnalyzerProps) {
  const [runtime, setRuntime] = useState(options[0].value);

  return (
    <div className="flex flex-col gap-2">
      <div>
        <select
          className="text-black"
          value={runtime}
          onChange={(e) => {
            setRuntime(e.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <iframe
        src={`/bundle-analyzer/view?runtime=${runtime}`}
        className="w-full h-[77vh] bg-white"
      />
    </div>
  );
}
