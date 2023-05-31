import { AppHistory } from '@/components/AppHistory/AppHistory';

export default async function Apps({ params: { appId } }: { params: { appId?: string[] } }) {
  if (appId?.[0]) {
    return <AppHistory />;
  }
  return (
    <div className="flex-1 flex items-center justify-center text-xl text-gray-500">
      Select a project from the sidebar
    </div>
  );
}
