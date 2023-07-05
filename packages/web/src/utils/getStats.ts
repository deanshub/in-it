import { Stats } from '@/db/models';
import Mongoose from 'mongoose';

export async function getStats(appId: string, statsId: string) {
  const stats = await Stats.findById(new Mongoose.Types.ObjectId(statsId));
  return stats;
}
