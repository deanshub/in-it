import dbConnect from '@/db/dbConnect';
import User from '@/db/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { NextAuthUser, nextAuthOptions } from '@/utils/auth';
import AppUsers from '@/db/models/AppUsers';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const id = (session.user as NextAuthUser).id;

  const userDoc = await User.findOne({ userNameInProvider: id, provider: 'github' });
  const appUsers = await AppUsers.find({ userId: userDoc?._id }).populate('appId');

  return NextResponse.json(appUsers.map((appUser) => appUser.appId));
}
