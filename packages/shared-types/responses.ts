export interface PostStatsResponse {
  type: 'local' | 'ci';
  appId: string;
  version: string;
  url: string;
}
