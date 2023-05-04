import { Stats } from 'in-it-shared-types';
import isCI from 'is-ci';

export async function sendToServer(stats: Stats, serverUrl: string): Promise<void> {
  if (serverUrl && isCI) {
    await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
  }
}
