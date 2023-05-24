import { NextResponse } from 'next/server';
import * as vercelBlob from '@vercel/blob';
import Stats from '@/db/Stats';
import { getAppId } from '@/utils/getAppId';
import { getNextVersion } from '@/utils/getNextVersion';
import { getUserId } from '@/utils/getUserId';
import type { PostStatsResponse } from 'in-it-shared-types';

export async function POST(request: Request) {
  const form = await request.formData();
  console.log(form);
  const files = form.getAll('file') as File[];
  console.log(files);
  // const file = form.get('file') as File;
  // const stats: Stats = await request.json();
  // store in DB

  const envirmonet = (form.get('envirmonet') as null | string) ?? 'local';
  let version = form.get('version') as null | string;
  const name = form.get('name') as null | string;
  const buildId = form.get('buildId') as null | string;
  const userEmail = form.get('userEmail') as null | string;
  const userName = form.get('userName') as null | string;
  const userNameInProvider = form.get('userNameInProvider') as null | string;
  const provider = (form.get('provider') as null | string) ?? 'github';
  const compilation = (form.get('compilation') as null | string) ?? 'client';
  const branch = form.get('branch') as null | string;
  const generatingTool = form.get('generatingTool') as null | string;
  const generatingToolVersion = form.get('generatingToolVersion') as null | string;
  const repository = form.get('repository') as null | string;
  const packagePath = form.get('packagePath') as null | string;
  const packageName = form.get('packageName') as null | string;

  // TODO: read sizes from the file
  const statSize = 0;
  const statGzipSize = 0;
  const parsedSize = 0;

  if (envirmonet !== 'local' && envirmonet !== 'ci') {
    return new NextResponse(`in-it stats "${envirmonet}" is not supported`, {
      status: 404,
    });
  }

  const appId = await getAppId({
    provider,
    repository,
    packagePath,
    name,
    packageName,
  });

  // check if appId exists in db
  // if not, create a new one
  // if yes, update the existing app
  if (!appId) {
    // create new app in db and return appId
  }

  if (!version) {
    version = await getNextVersion({
      appId,
      envirmonet,
      branch,
      compilation,
    });
  }

  try {
    const userId = await getUserId({
      userNameInProvider,
      provider,
      email: userEmail,
      name: userName,
    });
    if (!userId) {
      // set it as anonymous
    }
  } catch (error) {
    return new NextResponse(`User "${userNameInProvider ?? userEmail ?? ''}" not found`, {
      status: 404,
    });
  }

  // if connection between user and app does not exist, create one
  // await createAppUserConnection({
  //   appId,
  //   userId,
  // });

  const statsFilePath = `${envirmonet}/${compilation}/stats.json`;
  const { url: compilationStatsUrl } = await vercelBlob.put(statsFilePath, files[0], {
    access: 'public',
    contentType: 'application/json',
  });

  const stats = new Stats({
    appId,
    userId,
    version,
    buildId,
    envirmonet,
    branch,
    compilationStatsUrl,
    compilation,
    generatingTool,
    generatingToolVersion,

    repository,
    packagePath,
    name,
    packageName,
    statSize,
    statGzipSize,
    parsedSize,
  });

  // store in db
  await stats.save();

  // responed with hash & url
  const res: PostStatsResponse = {
    ...stats.toJSON(),
    url: `/analyze/${stats._id}`,
  };
  return NextResponse.json(res);
}
