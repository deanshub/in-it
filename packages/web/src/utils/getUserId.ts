import User from '../db/models/User';
import type { UserDocument } from 'in-it-shared-types';

export async function getUserId({
  userNameInProvider,
  provider,
  email,
}: Partial<
  Pick<UserDocument, 'userNameInProvider' | 'provider' | 'email' | 'name'>
>): Promise<UserDocument | null> {
  if (userNameInProvider && provider) {
    // query db for userId using userNameInProvider, provider
    const users = await User.find({
      userNameInProvider,
      provider,
    });
    // if exists, return userId
    if (users.length === 1) {
      return users[0];
    }
    if (users.length > 1) {
      throw new Error(
        `Multiple users found with userNameInProvider "${userNameInProvider}" and provider "${provider}"`,
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
