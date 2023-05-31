import clsx from 'clsx';
import { CardContent, CardDescription } from '../basic/card';
import { Input } from '../basic/input';
import { ProjectItem, getUserProjects } from '@/utils/getUserProjects';
import Link from 'next/link';

interface ProjectsSideBarProps {
  onChange?: (projectId: string) => void;
  selectedApp?: string;
}
export async function ProjectsSideBar({ onChange, selectedApp }: ProjectsSideBarProps) {
  const projects = await getUserProjects();
  // TODO: handle error, loading, empty state

  return (
    <div className="flex flex-col px-4 max-w-md">
      <SearchBox />
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
function ProjectsList({ filter, data, selectedApp }: ProjectsListProps) {
  // const onChange = console.log;

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
