import { UserDocument, AppsDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const userSchema = new Schema<UserDocument & { apps: AppsDocument[] }>(
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

const User: Model<UserDocument & { apps: AppsDocument[] }> =
  models.User ?? model<UserDocument & { apps: AppsDocument[] }>('User', userSchema);

export default User;
