import { getUserFilterByProvider } from './getUserFilterByProvider';
import { User } from '../models';
import type { SourceCodeProvider, UserDocument } from 'in-it-shared-types';

export async function upsertUserByProvider(
  email: string,
  provider: SourceCodeProvider,
  username: string,
  user: Partial<UserDocument>,
): Promise<UserDocument | undefined> {
  const providerUser = getUserFilterByProvider(provider, username);
  const dbUser = await User.findOneAndUpdate(
    { $or: [{ email }, providerUser] },
    {
      $set: {
        ...user,
        ...providerUser,
      },
      $setOnInsert: { email, role: 'user' },
    },
    { upsert: true },
  );

  return dbUser?.toJSON();
}
