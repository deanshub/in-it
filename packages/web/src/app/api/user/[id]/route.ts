import dbConnect from '@/db/dbConnect';
import User from '@/db/user';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id: userId } = params;

  const userDoc = await User.findById(userId)?.populate({
    path: 'apps',
    populate: { path: 'appId' },
  });
  const { apps, ...user } = userDoc?.toObject({ virtuals: true })!;

  return NextResponse.json({
    ...user,
    apps: apps.map(({ appId, ...rest }: any) => ({ ...rest, ...appId })),
  });
}
