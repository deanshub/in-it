import { UserWithApps } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const userSchema = new Schema<UserWithApps>(
  {
    githubUserName: {
      type: String,
      index: { unique: true },
    },
    gitlabUserName: {
      type: String,
      index: { unique: true },
    },
    bitbucketUserName: {
      type: String,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
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

export default User;
