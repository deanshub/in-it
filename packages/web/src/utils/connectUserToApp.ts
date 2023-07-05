import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './auth';
import { createAppUserConnection } from '@/db/helpers/createAppUserConnection';

export async function connectUserToApp(appId: string) {
  const session = await getServerSession(nextAuthOptions);

  if (session?.user?.dbUserId) {
    await createAppUserConnection({ appId, userId: session.user.dbUserId });
  }
}
