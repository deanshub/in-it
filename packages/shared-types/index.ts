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
    entry: string;
    chunks: Record<string, ChunkInfo>;
    assets: Record<string, { size: number }>;
}

export interface RollupStatsPluginOptions {
    entry: string;
    output: string;
}