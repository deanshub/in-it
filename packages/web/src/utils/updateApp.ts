import App from '../db/models/App';
import type { AppsDocument } from 'in-it-shared-types';

type UpdateAppOptions = Partial<AppsDocument>;

export async function updateApp(appId: string, options: UpdateAppOptions) {
  const app = await App.updateOne({ _id: appId }, options);
  return app;
}
