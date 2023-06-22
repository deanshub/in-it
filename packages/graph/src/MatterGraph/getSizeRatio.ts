import { minimumNodeSize, maximumNodeSize } from './defaultConsts';
import type Graph from 'graphology';

export interface SizeRatio {
  minSize: number;
  range: number;
  wantedRange: number;
}

export function getSizeRatio(graph: Graph): SizeRatio {
  const nodeSizes = new Set<number>();
  graph.forEachNode((_, node) => {
    nodeSizes.add(node.size);
  });
  const minSize = Math.min(...nodeSizes);
  const maxSize = Math.max(...nodeSizes);

  const range = maxSize - minSize;
  const wantedRange = maximumNodeSize - minimumNodeSize;

  return {
    minSize,
    range,
    wantedRange,
  };
}
