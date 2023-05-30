import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs-extra';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathQp = searchParams.get('path') ?? '';
  const files = await fs.readdir(path.join(process.cwd(), pathQp));

  return NextResponse.json(files);
}
