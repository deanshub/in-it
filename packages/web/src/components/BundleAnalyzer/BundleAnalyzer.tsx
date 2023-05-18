'use client';

import { useState } from 'react';

export function BundleAnalyzer() {
  const [runtime, setRuntime] = useState('client');

  return (
    <div className="flex flex-col gap-2">
      <div>
        <select className="text-black" value={runtime} onChange={(e) => setRuntime(e.target.value)}>
          <option value="client">Browser</option>
          <option value="nodejs">Node.js</option>
          <option value="edge">Edge</option>
        </select>
      </div>
      <iframe
        src={`/bundle-analyzer/view?runtime=${runtime}`}
        className="w-full h-[77vh] bg-white"
      />
    </div>
  );
}
