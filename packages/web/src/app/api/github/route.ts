import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { getOrThrow } from '@/utils/getOrThrow';

export async function GET(req: Request) {
  const privateKey = getOrThrow('PLAYGROUND_GITHUB_PRIVATE_KEY').replace(/\\n/g, '\n');
  const appId = getOrThrow('PLAYGROUND_GITHUB_APP_ID');
  const installationId = getOrThrow('PLAYGROUND_GITHUB_INSTALLATION_ID');

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId,
    },
  });
  // const app = new App({ appId, privateKey });

  // get the installation id
  // const { data: installations } = await octokit.rest.apps.listInstallations();
  // const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
  // const installationId = installations[0].id;

  // const { token } = await octokit.auth({
  //   type: "installation",
  //   // defaults to `options.auth.installationId` set in the constructor
  //   installationId: installationId,
  // });

  const { searchParams } = new URL(req.url)
  const head_sha = searchParams.get('head_sha') || '139d48ea6b9581ef32e40c1f8a3d4eb5f35b9d8d'
  const owner = searchParams.get('owner') || 'shamit6'
  const repo = searchParams.get('repo') || 'get-there'

  // create a check run
  await octokit.rest.checks.create({
    owner,
    repo,
    name: 'bundle size check',
    head_sha,
    status: 'queued', //queued, in_progress, or completed
    // conclusion: 'failure', //success, failure, neutral, cancelled, timed_out, or action_required
    // target_url: opts.targetUrl,
    description: 'waiting for bundle size check to complete',
  });

  return NextResponse.json({ message: 'ok' });
}
