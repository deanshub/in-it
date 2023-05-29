import { StatsDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const statsSchema = new Schema<StatsDocument>({
  appId: {
    type: String,
    required: true,
    ref: 'App',
    index: true,
  },
  userId: {
    type: String,
    // required: true,
    ref: 'User',
  },
  version: {
    type: String,
    required: true,
  },
  buildId: {
    type: String,
    required: true,
  },
  envirmonet: {
    type: String,
    required: true,
    enum: ['local', 'ci', 'web'],
    index: true,
  },
  branch: {
    type: String,
    // required: true,
  },
  compilationStatsUrl: {
    type: String,
    required: true,
  },
  compilation: {
    type: String,
    required: true,
  },
  generatingTool: {
    type: String,
    // required: true,
  },
  generatingToolVersion: {
    type: String,
    // required: true,
  },

  repository: {
    type: String,
    // required: true,
  },
  packagePath: {
    type: String,
    // required: true,
  },
  name: String,
  packageName: String,
  commitHash: String,

  statSize: {
    type: Number,
    required: true,
  },
  gzipSize: {
    type: Number,
    required: true,
  },
  parsedSize: {
    type: Number,
    required: true,
  },
});

statsSchema.index({ repository: 1, packagePath: 1 });

const Stats: Model<StatsDocument> = models.Stats ?? model<StatsDocument>('Stats', statsSchema);

export default Stats;
