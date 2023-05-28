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
    return { ...additionalFilter, githubUserName: userName };
  } else if (provider === 'gitlab') {
    return { ...additionalFilter, gitlabUserName: userName };
  } else if (provider === 'bitbucket') {
    return { ...additionalFilter, bitbucketUserName: userName };
  } else {
    throw new Error('Unknown provider');
  }
}
