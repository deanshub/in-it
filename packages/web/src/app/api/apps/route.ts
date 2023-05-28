import dbConnect from '@/db/dbConnect';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { nextAuthOptions } from '@/utils/auth';
import { AppUsers } from '@/db/models';
import { getUserByProvider } from '@/db/queries';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id: usernameInProvider, provider } = session.user;
  const userDoc = await getUserByProvider(provider, usernameInProvider);
  const appUsers = await AppUsers.find({ userId: userDoc?._id }).populate('appId');

  return NextResponse.json(appUsers.map((appUser) => appUser.appId));
}
