import { NextResponse } from 'next/server';
// @ts-expect-error-next-line
import { renderViewer } from 'webpack-bundle-analyzer/lib/template';
import fetch from 'node-fetch';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // const statsId = searchParams.get('statsId');
  const statsUrl = searchParams.get('statsUrl');
  if (!statsUrl) {
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
