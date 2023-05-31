import { AppHistory } from '@/components/AppHistory/AppHistory';
import dbConnect from '@/db/dbConnect';
import { createAppUserConnection } from '@/db/helpers/createAppUserConnection';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import { NextResponse } from 'next/server';

interface AppsPageProps {
  params: {
    appId?: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function connectUserToApp(appId: string) {
  const session = await getServerSession(nextAuthOptions);

  if (session?.user?.dbUserId) {
    await dbConnect();
    await createAppUserConnection({ appId, userId: session.user.dbUserId });
  }
}

export default async function Apps({ params: { appId }, searchParams: { page } }: AppsPageProps) {
  if (appId?.[0]) {
    connectUserToApp(appId[0]);
    const pageNumber = parseInt(page as string);
    /* @ts-expect-error Async Server Component */
    return <AppHistory appId={appId[0]} page={isNaN(pageNumber) ? 1 : pageNumber} />;
  }
  return <EmptyState />;
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center text-xl text-gray-500">
      Select a project from the sidebar
    </div>
  );
}
