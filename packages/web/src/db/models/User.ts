import { UserWithApps } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const userSchema = new Schema<UserWithApps>(
  {
    userNameInProvider: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
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

userSchema.index({ userNameInProvider: 1, provider: 1 }, { unique: true });

const User: Model<UserWithApps> = models.User ?? model<UserWithApps>('User', userSchema);

export default User;
