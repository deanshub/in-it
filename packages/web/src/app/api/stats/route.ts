import { NextResponse } from 'next/server';
// import { sql } from '@vercel/postgres';
import type { PostStatsResponse, Stats } from 'in-it-shared-types';

export async function POST(request: Request) {
  const stats: Stats = await request.json();
  // store in DB
  // responed with hash & url
  const res: PostStatsResponse = {
    type: 'local',
    appId: stats.appId ?? 'unknown',
    version: '0.0.0',
    url: 'http://nissix.com/in-it/stats/0.0.0',
  };
  return NextResponse.json({ res });
}
