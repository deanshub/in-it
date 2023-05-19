import { NextResponse } from 'next/server';
// @ts-expect-error-next-line
import { renderViewer } from 'webpack-bundle-analyzer/lib/template';
import { readJSON, exists } from 'fs-extra';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const runtime = searchParams.get('runtime') ?? 'client';
  // const inItStatsPath = path.join(process.cwd(), '.next/in-it-stats', `${runtime}.json`);
  const inItStatsPath = path.join(process.cwd(), '../../test-in-it-stats', `${runtime}.json`);
  if (!(await exists(inItStatsPath))) {
    return new NextResponse(`in-it stats "${runtime}" does not exist`, {
      status: 404,
    });
  }
  const chartData = await readJSON(inItStatsPath);
  const entrypoints = getEntrypoints(chartData);
  const html = renderViewer({
    mode: 'static',
    title: `in-it stats ${runtime}`,
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
