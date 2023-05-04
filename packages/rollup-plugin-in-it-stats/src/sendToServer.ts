import { Stats } from 'in-it-shared-types';

export async function sendToServer(stats: Stats, serverUrl: string): Promise<void> {
  if (serverUrl) {
    await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
  }
}
