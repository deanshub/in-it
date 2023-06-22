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
