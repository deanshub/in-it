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
  legacy?: boolean;
};

export interface User {
  githubUsername: string;
}

export interface BasicPackageData {
  repository?: string;
  packagePath: string;
  name?: string;
  packageName?: string;
  provider?: SourceCodeProvider; // (UK)
}

export interface CompilationSizes {
  statSize: number;
  gzipSize: number;
  parsedSize: number;
}

export type SourceCodeProvider = 'github' | 'gitlab' | 'bitbucket';

export interface InItConfig {
  track?: string | string[];
  limits?: Limit[];
}
export interface Limit {
  [glob: string]: {
    maxSize?: string;
    maxDifference?: string;
    ignorePattern?: string;
    prohibitedModules?: string[];
    allowedModules?: string[];
  };
}
