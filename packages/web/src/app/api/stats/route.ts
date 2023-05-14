import { NextResponse } from 'next/server';
// import * as vercelBlob from '@vercel/blob';
// import { sql } from '@vercel/postgres';
import type {
  PostStatsResponse,
  // Stats,
} from 'in-it-shared-types';

export async function POST(request: Request) {
  const form = await request.formData();
  console.log(form);
  const files = form.getAll('file') as File[];
  console.log(files);
  // const file = form.get('file') as File;
  // const stats: Stats = await request.json();
  // store in DB

  const type = (form.get('type') as null | string) ?? 'local';
  const appId = form.get('appId') as null | string;
  const userEmail = form.get('userEmail') as null | string;
  const userName = form.get('userName') as null | string;
  const githubUsername = form.get('githubUsername') as null | string;

  // TODO: use the data to store in DB
  console.log({
    userEmail,
    userName,
    githubUsername,
  });

  if (type !== 'local' && type !== 'ci') {
    return new NextResponse(`in-it stats "${type}" is not supported`, {
      status: 404,
    });
  }

  // const { url } = await vercelBlob.put('articles/blob.txt', 'Hello World!', { access: 'public' });
  // store in db
  // const { rows } = await sql`
  //   INSERT INTO products (name)
  //   VALUES (${stats.appId})
  // `;

  // responed with hash & url
  const res: PostStatsResponse = {
    type,
    appId: appId ?? 'unknown',
    version: '0.0.0',
    url: `/analyze`,
  };
  return NextResponse.json(res);
}
