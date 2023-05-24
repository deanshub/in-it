import clsx from 'clsx';
import { CardContent, CardDescription } from '../basic/card';
import { Input } from '../basic/input';
import { useMemo } from 'react';

interface ProjectsSideBarProps {
  onChange: (projectId: string) => void;
}
export function ProjectsSideBar({ onChange }: ProjectsSideBarProps) {
  // const [filter, setFilter] = useState('');
  return (
    <div className="flex flex-col px-4 max-w-md">
      <SearchBox />
      <AppList filter={''} />
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

interface AppListProps {
  // onChange: (projectId: string) => void;
  filter: string;
}
function AppList({ filter }: AppListProps) {
  const onChange = console.log;
  const items = useMemo(
    () => [
      { id: '1', label: 'my-project' },
      { id: '2', label: 'my-library' },
      { id: '3', label: 'my-internal-library' },
      { id: '4', label: 'my-app' },
    ],
    [],
  );
  return (
    <div className="flex flex-col pt-2">
      <CardDescription className="pb-1">Projects</CardDescription>
      <CardContent className="px-2">
        {items.map((item) => (
          <AppItem key={item.id} text={item.label} active={item.label === 'my-project'} />
        ))}
      </CardContent>
    </div>
  );
}

interface AppItemProps {
  text: string;
  active?: boolean;
  // onClick: () => void;
}
function AppItem({ text, active }: AppItemProps) {
  return (
    <div
      className={clsx(
        'flex text-sm space-x-4 rounded-md p-2 cursor-pointer hover:text-accent-foreground hover:bg-accent',
        {
          [`bg-accent text-accent-foreground`]: active,
        },
      )}
    >
      {/* favorite toggle button */}
      <span>{text}</span>
    </div>
  );
}
