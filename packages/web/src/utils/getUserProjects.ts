import dbConnect from '@/db/dbConnect';
import { AppUsers } from '@/db/models';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from './auth';
import { AppsDocument } from 'in-it-shared-types';

export interface ProjectItem {
  id: string;
  label: string;
}

export async function getUserProjects(): Promise<ProjectItem[]> {
  await dbConnect();

  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.dbUserId) {
    return [];
  }

  const appUsers = await AppUsers.find({ userId: session.user.dbUserId }).populate('appId');

  return appUsers.map((p) => {
    // TODO: fix type casting
    const app = p.appId as unknown as AppsDocument;
    return {
      id: app._id.toString(),
      label: app.name ?? app.packageName ?? app.repository ?? app._id.toString(),
    };
  });
}
