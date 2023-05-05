import isCI from 'is-ci';
import pc from 'picocolors';
import type { PostStatsResponse, Stats } from 'in-it-shared-types';

export async function sendToServer(
  stats: Stats,
  serverUrl: string,
): Promise<PostStatsResponse | null> {
  if (serverUrl && isCI) {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    const { data } = await response.json();
    const postData: PostStatsResponse = data;
    console.log(pc.green(`Rollup In-It Plugin: stats sent, see ${pc.underline(postData.url)}`));
    return postData;
  }
  return null;
}
