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
  environment: 'local' | 'ci';
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
  provider?: SourceCodeProvider; // (UK)
  repository?: string;
  packagePath: string;
  name?: string;
  packageName?: string;
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
export interface BundleStatsReport {
  label: string;
  statSize: number;
  parsedSize: number;
  gzipSize: number;
}
