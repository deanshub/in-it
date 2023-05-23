import { UserDocument } from 'in-it-shared-types';
import { Schema, model, models, Model } from 'mongoose';

const userSchema = new Schema<UserDocument>({
  userNameInProvider: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    unique: true,
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
});

userSchema.index({ userNameInProvider: 1, provider: 1 }, { unique: true });

const User: Model<UserDocument> = models.User ?? model<UserDocument>('User', userSchema);

export default User;
