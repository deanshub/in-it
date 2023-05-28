import App from '../db/models/App';
import type { AppsDocument } from 'in-it-shared-types';

type CreateAppOptions = Partial<AppsDocument>;

export async function createApp(options: CreateAppOptions) {
  const app = new App(options);
  await app.save();
  return app;
}
