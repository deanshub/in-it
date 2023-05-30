import dbConnect from '@/db/dbConnect';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { nextAuthOptions } from '@/utils/auth';
import { AppUsers } from '@/db/models';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { dbUserId } = session.user;
  const appUsers = await AppUsers.find({ userId: dbUserId }).populate('appId');

  return NextResponse.json(appUsers.map((appUser) => appUser.appId));
}
