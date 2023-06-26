import Graph from 'graphology';
import {
  circular,
  // random, circlepack
} from 'graphology-layout';
// import forceAtlas2 from 'graphology-layout-forceatlas2';
import type { SigmaGraph, SigmaEdge, MatterGraphProps } from '../types/basics';

interface Node {
  id: string;
  size?: number;
  label: string;
  module: boolean;
}

export function toGraph(data: SigmaGraph): Graph {
  const graph = new Graph();

  data.nodes.forEach((node) => {
    graph.addNode(node.id, node);
  });
  data.edges.forEach((edge) => {
    graph.addEdge(edge.from, edge.to, edge);
  });

  // random.assign(graph, { center: 600, scale: 700 });
  circular.assign(graph, { center: 0.5, scale: 20 });
  // circlepack.assign(graph, { center: 600, scale: 10 });
  // graph.forEachNode(console.log);

  // graph.updateNodeAttribute('SOURCE_CODE', 'isStatic', () => true);

  // forceAtlas2.assign(graph, {
  //   iterations:50,o
  //   settings:{
  //     scalingRatio: 30,
  //     // linLogMode: true,
  //     outboundAttractionDistribution:true,
  //     // adjustSizes: true,
  //     // edgeWeightInfluence: 0.001,
  //     // strongGravityMode: true,
  //     // gravity: 10,
  //     // slowDown: 10,
  //     barnesHutOptimize: true,
  //     barnesHutTheta: 5
  //   },
  // });

  return graph;
}

export function toSigmaGraph(deps: MatterGraphProps['data']): SigmaGraph {
  let index = 0;
  const nodes = new Map<string, Node>();
  const edges: SigmaEdge[] = [];

  for (const [chunkName, chunkDeps] of Object.entries(deps)) {
    if (!nodes.has(chunkName)) {
      nodes.set(chunkName, {
        id: chunkName,
        label: chunkName,
        size: chunkDeps.gzipSize,
        module: false,
      });
    }

    for (const dep of chunkDeps.chunkDependencies) {
      if (!nodes.has(dep)) {
        nodes.set(dep, {
          id: dep,
          label: dep,
          size: deps[dep]?.gzipSize,
          module: false,
        });
      }

      edges.push({
        id: `${index++}`,
        from: chunkName,
        to: dep,
      });
    }
  }
  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}
