import { User } from './models';

export function getUserByProvider(provider: string, username: string) {
  let filter;
  if (provider === 'github') {
    filter = { githubUserName: username };
  } else {
    throw new Error('Unknown provider');
  }

  return User.findOne(filter);
}
