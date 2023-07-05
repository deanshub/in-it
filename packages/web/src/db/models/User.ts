import { UserWithApps } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';
import { wrapWithDbConnect } from '../helpers/wrapWithDbConnect';

const userSchema = new Schema<UserWithApps>(
  {
    githubUsername: {
      type: String,
      index: true,
    },
    gitlabUsername: {
      type: String,
      index: true,
    },
    bitbucketUsername: {
      type: String,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
    },
    name: String,
    avatarUrl: String,
  },
  { timestamps: true },
);

userSchema.virtual('apps', {
  ref: 'AppUsers',
  localField: '_id',
  foreignField: 'userId',
});

const User: Model<UserWithApps> = models.User ?? model<UserWithApps>('User', userSchema);

export default wrapWithDbConnect(User);
