import { ProjectsSideBar } from '@/components/ProjectsSideBar/ProjectsSideBar';

export default async function AppsLayout({
  children,
  params: { appId },
}: {
  children: React.ReactNode;
  params: { appId?: string[] };
}) {
  return (
    <div className="flex">
      {/* @ts-expect-error Async Server Component */}
      <ProjectsSideBar selectedApp={appId?.[0]} />
      {children}
    </div>
  );
}
