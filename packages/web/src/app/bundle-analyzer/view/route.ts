import { NextResponse } from 'next/server';
// @ts-expect-error-next-line
import { renderViewer } from 'webpack-bundle-analyzer/lib/template';
import fetch from 'node-fetch';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import { AppUsers } from '@/db/models';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // const statsId = searchParams.get('statsId');
  const appId = searchParams.get('appId');
  const statsUrl = searchParams.get('statsUrl');
  if (!statsUrl || !appId) {
    return new NextResponse('statsUrl is required', {
      status: 400,
    });
  }

  const response = await fetch(statsUrl);
  if (!response.ok) {
    return new NextResponse(
      `Error fetching compilation stats: ${response.status} ${response.statusText}`,
      {
        status: 400,
      },
    );
  }
  const chartData = await response.json();

  const entrypoints = getEntrypoints(chartData);
  const html = renderViewer({
    mode: 'static',
    title: `in-it stats ${statsUrl}`,
    chartData,
    entrypoints,
    defaultSizes: 'parsed',
    enableWebSocket: false,
  });

  // get user from session
  const session = await getServerSession(nextAuthOptions);
  // connect app and user in db (no await)
  if (session?.user?.dbUserId) {
    addAppUser(session.user.dbUserId, appId);
  }

  return new NextResponse(html, { headers: { 'content-type': 'text/html' } });
}

function getEntrypoints(chartData: { label: string }[]) {
  const entrypoints = chartData
    // .filter((part) => {
    //   return !part.label.includes('/chunks/');
    // })
    .map((part) => {
      return part.label;
    });
  return entrypoints;
}

async function addAppUser(userId: string, appId: string) {
  await AppUsers.findOneAndUpdate(
    { userId, appId },
    {
      $setOnInsert: {
        userId,
        appId,
      },
    },
    { upsert: true },
  );
}
