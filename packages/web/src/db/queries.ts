import { User } from './models';
import type { SourceCodeProvider, UserDocument } from 'in-it-shared-types';
import type { FilterQuery } from 'mongoose';

export function getUserByProvider(provider: SourceCodeProvider, userName: string) {
  return User.findOne(getUserFilterByProvider(provider, userName));
}

export function getUserFilterByProvider(
  provider: SourceCodeProvider,
  userName: string,
  additionalFilter: FilterQuery<UserDocument> = {},
): FilterQuery<UserDocument> {
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
  const dbUser = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        ...getUserFilterByProvider(provider, username),
        ...user,
      },
      $setOnInsert: { email, role: 'user' },
    },
    { upsert: true },
  );

  return dbUser?._id?.toString();
}
