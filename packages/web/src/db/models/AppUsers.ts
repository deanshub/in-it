import { AppUsersDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';
import { wrapWithDbConnect } from '../helpers/wrapWithDbConnect';

const appUsersSchema = new Schema(
  {
    appId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'App',
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true,
    },
  },
  { timestamps: true },
);

appUsersSchema.index({ userId: 1, appId: 1 }, { unique: true });

const AppUsers: Model<AppUsersDocument> =
  models.AppUsers ?? model<AppUsersDocument>('AppUsers', appUsersSchema);

export default wrapWithDbConnect(AppUsers);
