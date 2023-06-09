import clsx from 'clsx';
import { CardContent, CardDescription, CardFooter } from '../basic/card';
import { Input } from '../basic/input';
import { ProjectItem, getUserProjects } from '@/utils/getUserProjects';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/utils/auth';
import { Login } from '../TopBar/TopBar';

interface ProjectsSideBarProps {
  onChange?: (projectId: string) => void;
  selectedApp?: string;
}
export async function ProjectsSideBar({ onChange, selectedApp }: ProjectsSideBarProps) {
  const projects = await getUserProjects(selectedApp);
  // TODO: handle error, loading, empty state

  return (
    <div className="flex flex-col px-4 max-w-md">
      <SearchBox />
      {/* @ts-expect-error Async Server Component */}
      <ProjectsList selectedApp={selectedApp} data={projects} filter={''} />
    </div>
  );
}

// interface SearchBoxProps {
//   onChange: (value: string) => void;
// }
function SearchBox() {
  return (
    <div className="flex flex-col">
      <Input
        disabled
        type="search"
        placeholder="Search project..."
        // onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface ProjectsListProps {
  // onChange: (projectId: string) => void;
  filter: string;
  data: ProjectItem[];
  selectedApp?: string;
}
async function ProjectsList({ filter, data, selectedApp }: ProjectsListProps) {
  // const onChange = console.log;
  const session = await getServerSession(nextAuthOptions);

  return (
    <div className="flex flex-col pt-2">
      <CardDescription className="pb-1">Projects</CardDescription>
      <CardContent className="px-2">
        {data.map((item) => (
          <ProjectItem
            key={item.id}
            text={item.label}
            id={item.id}
            active={item.id === selectedApp}
          />
        ))}
      </CardContent>
      {session?.user ? null : (
        <CardFooter className="pt-2">
          <div className="text-sm font-light flex flex-col items-center justify-center">
            <Login variant="link" /> to see your projects.
          </div>
        </CardFooter>
      )}
    </div>
  );
}

interface AppItemProps {
  id: string;
  text: string;
  active?: boolean;
  // onClick: () => void;
}
function ProjectItem({ text, active, id }: AppItemProps) {
  return (
    <Link
      replace
      href={`/apps/${id}`}
      className={clsx(
        'flex text-sm space-x-4 rounded-md p-2 cursor-pointer hover:text-accent-foreground hover:bg-accent',
        {
          [`bg-accent text-accent-foreground`]: active,
        },
      )}
    >
      {/* favorite toggle button */}
      <span>{text}</span>
    </Link>
  );
}
