import { NextResponse } from 'next/server';
import { getOrThrow } from './getOrThrow';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';

interface ReportBundleSizeStatusCheckParams {
  packageName: string;
  commitHash: string;
  repository: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required';
  target_url?: string;
}

export async function reportBundleSizeStatusCheck({
  packageName,
  commitHash: head_sha,
  repository,
  status,
  conclusion,
}: // target_url,
ReportBundleSizeStatusCheckParams) {
  const privateKey = getOrThrow('NISSIX_GITHUB_PRIVATE_KEY').replace(/\\n/g, '\n');
  const appId = getOrThrow('NISSIX_GITHUB_APP_ID');
  const githubAppUrl = getOrThrow('NISSIX_GITHUB_APP_URL');

  const [owner, repoName] = repository.split('/');

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
    repo: repoName,
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
      repo: repoName,
      name: `${packageName} - bundle size check`,
      head_sha,
      status: status ?? 'completed', //queued, in_progress, or completed
      conclusion: conclusion ?? 'success', //success, failure, neutral, cancelled, timed_out, or action_required
      // target_url,
      description,
    });
    return `Bundle size analysis status check was created, you can follow its run here: ${response.data.html_url}`;
  } catch (e: unknown) {
    const error = e as RequestError;
    if (error.status === 403) {
      return `To enable bundle size status check please click here: ${githubAppUrl}`;
    } else {
      throw e;
    }
  }
}
