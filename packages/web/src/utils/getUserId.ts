import { UserDocument } from 'in-it-shared-types';

export async function getUserId({
  userNameInProvider,
  provider,
  email,
}: Partial<Pick<UserDocument, 'userNameInProvider' | 'provider' | 'email' | 'name'>>): Promise<
  string | null
> {
  if (userNameInProvider && provider) {
    // query db for userId using userNameInProvider, provider
    // if exists, return userId
    // if not, return null
  }
  if (email) {
    // query db for userId using userEmail
    // if exists (and it's the only one), return userId
    // if not, return null
  }
  // if (!userNameInProvider && !email) {
  //    return null;
  // }

  throw new Error(`User "${userNameInProvider ?? email ?? ''}" not found`);
}
