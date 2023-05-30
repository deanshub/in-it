import { App, AppUsers } from '@/db/models';
import dbConnect from '@/db/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  const persistApp = await App.create({
    repository: 'deanshub/in-it',
    packagePath: '/packages/web',
    name: 'init dashboard',
    packageName: 'in-it-web',
  });
  // console.log('request.body', request.body)
  // return NextResponse.json(persistApp.toJSON());
  // await AppUsers.create({ userId: '64734ff8138b134439f0daf1', appId: '646dcd854fae421cfc647cd7' });
  await AppUsers.create({ userId: '64734ff8138b134439f0daf1', appId: persistApp.toJSON()._id });
  await AppUsers.create({ userId: '646cc48bd81654bf36203d90', appId: persistApp.toJSON()._id });

  return NextResponse.json({ success: true });
}
