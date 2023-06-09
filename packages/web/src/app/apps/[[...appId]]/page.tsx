import { AppHistory } from '@/components/AppHistory/AppHistory';
import { connectUserToApp } from '@/utils/connectUserToApp';

interface AppsPageProps {
  params: {
    appId?: string[];
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Apps({
  params: { appId },
  searchParams: { page, branch, environment },
}: AppsPageProps) {
  if (appId?.[0]) {
    let env: undefined | 'ci' | 'local' | 'web';
    if ((environment && environment === 'web') || environment === 'local') {
      env = environment;
    }
    connectUserToApp(appId[0]);
    const pageNumber = parseInt(page as string);
    return (
      /* @ts-expect-error Async Server Component */
      <AppHistory
        branch={(branch as string) ?? 'master'}
        appId={appId[0]}
        page={isNaN(pageNumber) ? 1 : pageNumber}
        environment={env ?? 'ci'}
      />
    );
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
