import { NextResponse } from 'next/server';
import {oauthAuthorizationUrl} from '@octokit/oauth-authorization-url';
import { getOrThrow } from '@/utils/getOrThrow';

export async function GET(req: Request) {

  const privateKey  = process.env.PLAYGROUND_GITHUB_PRIVATE_KEY!.replace(/\\n/g, '\n')
  const appId = process.env.PLAYGROUND_GITHUB_APP_ID!
  const clientId = process.env.PLAYGROUND_GITHUB_APP_CLIENT_ID!
  const clientSecret = process.env.PLAYGROUND_GITHUB_CLIENT_SECRET_ID!
  const installationId = process.env.PLAYGROUND_GITHUB_INSTALLATION_ID!

  // const app = new App({
  //   appId,
  //   privateKey,
  // });
  // const octokit = await app.getInstallationOctokit(Number(installationId));

  const baseUrl = getOrThrow('NEXTAUTH_URL');
  const { url, redirectUrl, login, state } = oauthAuthorizationUrl({
    clientType: "github-app",
    clientId,
    redirectUrl: `${baseUrl}/github-check-app-installation`,
    login: "octocat",
    state: "secret123",
  });

  
  return NextResponse.redirect(url);
}