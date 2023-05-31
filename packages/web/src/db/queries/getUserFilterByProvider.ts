import type { SourceCodeProvider, UserDocument } from 'in-it-shared-types';

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
