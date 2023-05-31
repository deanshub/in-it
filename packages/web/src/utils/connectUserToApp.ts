import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './auth';
import dbConnect from '@/db/dbConnect';
import { createAppUserConnection } from '@/db/helpers/createAppUserConnection';

export async function connectUserToApp(appId: string) {
  const session = await getServerSession(nextAuthOptions);

  if (session?.user?.dbUserId) {
    await dbConnect();
    await createAppUserConnection({ appId, userId: session.user.dbUserId });
  }
}
