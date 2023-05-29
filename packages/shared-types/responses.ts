import { StatsDocument } from './documents';

export interface PostStatsResponse extends StatsDocument {
  url: string;
}
