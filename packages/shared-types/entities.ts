export interface ModuleInfo {
  id: string;
  size: number;
  name: string;
  rendered: string[];
  // imported: string[];
  // dependedOn: string[];
}

export interface ChunkInfo {
  size: number;
  modules: ModuleInfo[];
}

export interface Stats {
  appId?: string;
  // version: string;
  // commit: string;
  type: 'local' | 'ci';
  entry: string;
  chunks: Record<string, ChunkInfo>;
  assets: Record<string, { size: number }>;
}

export interface InItStatsPluginOptions {
  appId?: string;
  entry: string;
  output: string;
  serverUrl: string;
}
export type RollupStatsPluginOptions = InItStatsPluginOptions;
export type NextStatsPluginOptions = Omit<InItStatsPluginOptions, 'entry' | 'output'> & {
  outDir?: string;
};

export interface User {
  githubUsername: string;
}
