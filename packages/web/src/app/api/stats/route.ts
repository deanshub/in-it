import { NextResponse } from 'next/server';
import { BASE_URL } from '@/utils/url';
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

  if (type !== 'local' && type !== 'ci') {
    return new NextResponse(`in-it stats "${type}" is not supported`, {
      status: 404,
    });
  }

  // responed with hash & url
  const res: PostStatsResponse = {
    type,
    appId: appId ?? 'unknown',
    version: '0.0.0',
    url: `${BASE_URL}/analyze`,
  };
  return NextResponse.json(res);
}
