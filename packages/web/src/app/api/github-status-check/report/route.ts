import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { getOrThrow } from '@/utils/getOrThrow';
import type { RequestError } from '@octokit/request-error';

export async function GET(req: Request) {
  const privateKey = getOrThrow('PLAYGROUND_GITHUB_PRIVATE_KEY').replace(/\\n/g, '\n');
  const appId = getOrThrow('PLAYGROUND_GITHUB_APP_ID');
  const baseUrl = getOrThrow('NEXTAUTH_URL');

  const { searchParams } = new URL(req.url);
  const head_sha = searchParams.get('head_sha');
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const status = searchParams.get('status');
  const conclusion = searchParams.get('conclusion');
  const target_url = searchParams.get('target_url');

  if (!head_sha || !owner || !repo) {
    return NextResponse.json({
      message: 'head_sha, owner and repo are required',
    });
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
    },
  });

  const {
    data: { id: installationId },
  } = await octokit.rest.apps.getRepoInstallation({
    repo,
    owner,
  });

  const description =
    status === 'completed' ? 'Bundle size analysis completed' : 'Bundle size analysis in progress';
  try {
    const installationOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        installationId,
      },
    });
    const response = await installationOctokit.rest.checks.create({
      installationId,
      owner,
      repo,
      name: 'bundle size check',
      head_sha,
      status: status ?? 'completed', //queued, in_progress, or completed
      conclusion: conclusion ?? 'success', //success, failure, neutral, cancelled, timed_out, or action_required
      target_url,
      description,
    });
    return NextResponse.json({
      message: `Bundle size analysis status check was created, you can follow its run here: ${response.data.html_url}`,
    });
  } catch (e: unknown) {
    const error = e as RequestError;
    if (error.status === 403) {
      return NextResponse.json({
        message: `To enable bundle size status check please click here: ${baseUrl}/api/github/installation`,
      });
    } else {
      throw e;
    }
  }
}
