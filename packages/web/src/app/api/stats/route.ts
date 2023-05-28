import { NextResponse } from 'next/server';
import * as vercelBlob from '@vercel/blob';
import Stats from '@/db/Stats';
import { getAppId } from '@/utils/getAppId';
import { getUserId } from '@/utils/getUserId';
import { createApp } from '@/db/helpers/createApp';
import { updateApp } from '@/db/helpers/updateApp';
import dbConnect from '@/db/dbConnect';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import type { PostStatsResponse } from 'in-it-shared-types';
import { createUser } from '@/db/helpers/createUser';

export async function POST(request: Request) {
  const session = await getServerSession(nextAuthOptions);
  // TODO: user user session after Amit's PR

  const form = await request.formData();
  console.log(form);
  const files = form.getAll('file') as File[];
  console.log(files);
  // const file = form.get('file') as File;
  // const stats: Stats = await request.json();
  // store in DB

  const envirmonet = (form.get('envirmonet') as null | string) ?? 'local';
  const version = getNullAsUndefined(form.get('version') as null | string);
  const name = getNullAsUndefined(form.get('name') as null | string);
  const buildId = getNullAsUndefined(form.get('buildId') as null | string);
  const userEmail = getNullAsUndefined(form.get('userEmail') as null | string);
  const userName = getNullAsUndefined(form.get('userName') as null | string);
  const userNameInProvider = getNullAsUndefined(form.get('userNameInProvider') as null | string);
  const provider = getNullAsUndefined(form.get('provider') as null | string);
  const compilation = (form.get('compilation') as null | string) ?? 'client';
  const branch = getNullAsUndefined(form.get('branch') as null | string);
  const generatingTool = getNullAsUndefined(form.get('generatingTool') as null | string);
  const generatingToolVersion = getNullAsUndefined(
    form.get('generatingToolVersion') as null | string,
  );
  const repository = getNullAsUndefined(form.get('repository') as null | string);
  const packagePath = getNullAsUndefined(form.get('packagePath') as null | string);
  const packageName = getNullAsUndefined(form.get('packageName') as null | string);

  // TODO: read sizes from the file
  const statSize = 0;
  const statGzipSize = 0;
  const parsedSize = 0;

  if (envirmonet !== 'local' && envirmonet !== 'ci') {
    return new NextResponse(`in-it stats "${envirmonet}" is not supported`, {
      status: 404,
    });
  }

  if (provider && provider !== 'github' && provider !== 'gitlab' && provider !== 'bitbucket') {
    return new NextResponse(`Provider "${provider}" is not supported`, {
      status: 404,
    });
  }

  await dbConnect();
  let appId = await getAppId({
    provider: provider as undefined | 'github' | 'gitlab' | 'bitbucket',
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
    const app = await createApp({
      provider: provider as undefined | 'github' | 'gitlab' | 'bitbucket',
      repository,
      packagePath,
      name,
      packageName,
    });
    appId = app._id;
  } else {
    // update existing app in db (no await intentionally)
    updateApp(appId, {
      provider: provider as undefined | 'github' | 'gitlab' | 'bitbucket',
      repository,
      packagePath,
      name,
      packageName,
    });
    // console.log('App updated');
  }

  // if (!version) {
  //   version = await getNextVersion({
  //     appId,
  //     envirmonet,
  //     branch,
  //     compilation,
  //   });
  // }

  // try {
  let user = await getUserId({
    userNameInProvider,
    provider: provider as undefined | 'github' | 'gitlab' | 'bitbucket',
    email: userEmail,
    name: userName,
  });
  if (!user && ((userNameInProvider && provider) || userEmail)) {
    // create user in DB
    user = await createUser({
      userNameInProvider,
      provider: provider as undefined | 'github' | 'gitlab' | 'bitbucket',
      email: userEmail,
      name: userName,
      avatarUrl: getNullAsUndefined(session?.user?.image),
      role: 'user',
    });
  }
  // } catch (error) {
  //   return new NextResponse(`User "${userNameInProvider ?? userEmail ?? ''}" not found`, {
  //     status: 404,
  //   });
  // }

  // if connection between user and app does not exist, create one (no await intentionally)
  if (user) {
    createAppUserConnection({
      appId,
      userId: user._id,
    });
  }

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

function getNullAsUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}
