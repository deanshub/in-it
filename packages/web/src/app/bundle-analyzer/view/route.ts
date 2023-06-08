import { NextResponse } from 'next/server';
// @ts-expect-error-next-line
import { renderViewer } from 'webpack-bundle-analyzer/lib/template';
import fetch from 'node-fetch';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import { AppUsers } from '@/db/models';
import { diffChartData } from '@/diffing/diffChartData';
import type { BundleStatsReport } from 'in-it-shared-types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // const statsId = searchParams.get('statsId');
  const appId = searchParams.get('appId');
  const statsUrl = searchParams.get('statsUrl');
  const baseStatsUrl = searchParams.get('baseStatsUrl');
  if (!statsUrl || !appId) {
    return new NextResponse('statsUrl is required', {
      status: 400,
    });
  }

  const fetchers = [fetch(statsUrl)];
  if (baseStatsUrl) {
    fetchers.push(fetch(baseStatsUrl));
  }

  const [statsResponse, baseStatsResponse] = await Promise.all(fetchers);
  if (!statsResponse.ok) {
    return new NextResponse(
      `Error fetching compilation stats: ${statsResponse.status} ${statsResponse.statusText}`,
      {
        status: 400,
      },
    );
  }
  if (baseStatsResponse && !baseStatsResponse.ok) {
    return new NextResponse(
      `Error fetching compilation stats: ${baseStatsResponse.status} ${baseStatsResponse.statusText}`,
      {
        status: 400,
      },
    );
  }

  const jsonPromises = [statsResponse.json()];
  if (baseStatsResponse) {
    jsonPromises.push(baseStatsResponse.json());
  }
  const [targetChartData, baseChartData]: BundleStatsReport[] = await Promise.all(jsonPromises);
  const chartData = diffChartData(baseChartData, targetChartData);

  const entrypoints = getEntrypoints(chartData);
  const html = renderViewer({
    // mode: 'static',
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

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html',
      'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
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
