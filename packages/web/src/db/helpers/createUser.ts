import User from '../models/User';
import type { UserDocument } from 'in-it-shared-types';

export async function createUser(options: Partial<UserDocument>): Promise<UserDocument> {
  const user = new User(options);

  await user.save();

  return user;
}
