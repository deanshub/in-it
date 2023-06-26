import dbConnect from '@/db/dbConnect';
import { Stats } from '@/db/models';
import Mongoose from 'mongoose';

export async function getStats(appId: string, statsId: string) {
  await dbConnect();
  const stats = await Stats.findById(new Mongoose.Types.ObjectId(statsId));
  return stats;
}
