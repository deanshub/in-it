import { AppUsersDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const appUsersSchema = new Schema(
  {
    appId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'App',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const AppUsers: Model<AppUsersDocument> =
  models.AppUsers ?? model<AppUsersDocument>('AppUsers', appUsersSchema);

export default AppUsers;
