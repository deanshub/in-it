import pc from 'picocolors';
import type { PostStatsResponse, Stats } from 'in-it-shared-types';

export async function sendToServer(
  stats: Stats,
  serverUrl: string,
): Promise<PostStatsResponse | null> {
  if (serverUrl) {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });

    const data: PostStatsResponse = await response.json();
    console.log(`Rollup In-It Plugin: ${pc.green(`Stats sent, see ${pc.underline(data.url)}`)}`);
    return data;
  }
  return null;
}
