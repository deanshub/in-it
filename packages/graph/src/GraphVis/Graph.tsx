import Graph from 'react-graph-vis';
import type { SigmaGraph } from '../../types/basics';

const options = {
  layout: {
    hierarchical: true,
  },
  edges: {
    color: '#000000',
  },
};

export default function DepsGraph({ data }: { data: SigmaGraph }) {
  if (!window) return null;
  return <Graph graph={data} options={options} />;
}
