import dbConnect from '@/db/dbConnect';
import User from '@/db/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { nextAuthOptions } from '@/utils/auth';

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // TODO change to user db id
  const email = session.user!.email;
  const userDoc = await User.findOne({ email })?.populate({
    path: 'apps',
    populate: { path: 'appId' },
  });
  const { apps } = userDoc?.toObject({ virtuals: true })!;

  // @ts-ignore
  return NextResponse.json(apps.map(({ appId }) => appId));
}
