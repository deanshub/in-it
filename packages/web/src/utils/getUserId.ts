import User from '../db/models/User';
import type { UserDocument } from 'in-it-shared-types';

export async function getUserId({
  githubUsername,
  gitlabUsername,
  bitbucketUsername,
  email,
}: Partial<UserDocument>): Promise<UserDocument | null> {
  if (githubUsername || gitlabUsername || bitbucketUsername) {
    // query db for userId using userNameInProvider, provider
    const users = await User.find({
      $or: [
        {
          githubUsername,
        },
        {
          gitlabUsername,
        },
        {
          bitbucketUsername,
        },
      ],
    });
    // if exists, return userId
    if (users.length === 1) {
      return users[0];
    }
    if (users.length > 1) {
      throw new Error(
        `Multiple users found with userNameInProvider "${
          githubUsername ?? gitlabUsername ?? bitbucketUsername ?? ''
        }"`,
      );
    }
  }
  if (email) {
    // query db for userId using userEmail
    const users = await User.find({
      email,
    });
    // if exists (and it's the only one), return userId
    if (users.length === 1) {
      return users[0];
    }
    if (users.length > 1) {
      throw new Error(`Multiple users found with email "${email}"`);
    }
  }

  return null;
  // throw new Error(`User "${userNameInProvider ?? email ?? ''}" not found`);
}
