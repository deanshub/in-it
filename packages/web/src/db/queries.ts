import { User } from './models';
import type { SourceCodeProvider, UserDocument } from 'in-it-shared-types';

export function getUserByProvider(provider: SourceCodeProvider, userName: string) {
  return User.findOne(getUserFilterByProvider(provider, userName));
}

export function getUserFilterByProvider(
  provider: SourceCodeProvider,
  userName: string,
  additionalFilter: Partial<UserDocument> = {},
): Partial<UserDocument> {
  if (provider === 'github') {
    return { ...additionalFilter, githubUsername: userName };
  } else if (provider === 'gitlab') {
    return { ...additionalFilter, gitlabUsername: userName };
  } else if (provider === 'bitbucket') {
    return { ...additionalFilter, bitbucketUsername: userName };
  } else {
    throw new Error('Unknown provider');
  }
}

export async function upsertUserByProvider(
  email: string,
  provider: SourceCodeProvider,
  username: string,
  user: Partial<UserDocument>,
): Promise<string | undefined> {
  const providerUser = await getUserFilterByProvider(provider, username);
  const dbUser = await User.findOneAndUpdate(
    { $or: [{ email }, providerUser ] },
    {
      $set: {
        ...user,
        ...providerUser,
      },
      $setOnInsert: { email, role: 'user' },
    },
    { upsert: true },
  );

  return dbUser?._id?.toString();
}
