export interface SigmaGraph {
  nodes: SigmaNode[];
  edges: SigmaEdge[];
}

export interface SigmaNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  module: boolean;
}

export interface SigmaEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  color?: string;
}

export interface Dependencies {
  chunkDependencies: Set<string>;
  gzipSize: number;
  statSize: number;
  parsedSize: number;
}

export interface DependencyProps {
  chunkDependencies: string[];
  parsedSize: number;
  gzipSize: number;
  statSize: number;
}
export interface MatterGraphProps {
  data: Record<string, DependencyProps>;
}
