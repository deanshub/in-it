import AppUsers from '../models/AppUsers';
import type { AppUsersDocument } from 'in-it-shared-types';

export async function createAppUserConnection({ appId, userId }: AppUsersDocument) {
  const appUser = await AppUsers.updateOne(
    { appId, userId },
    {
      $setOnInsert: { appId, userId },
    },
    { upsert: true },
  );
  return appUser;
}
