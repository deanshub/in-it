interface ProjectsSideBarProps {
  onChange: (projectId: string) => void;
}
export function ProjectsSideBar({ onChange }: ProjectsSideBarProps) {
  return (
    <div className="flex flex-col">
      <SearchBox />
      <AppList onChange={onChange} />
    </div>
  );
}

function SearchBox() {
  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Search..." />
    </div>
  );
}

interface AppListProps {
  onChange: (projectId: string) => void;
}
function AppList({ onChange }: AppListProps) {
  return (
    <div className="flex flex-col">
      <AppItem />
    </div>
  );
}
function AppItem() {
  return (
    <div className="flex">
      {/* favorite toggle button */}
      <label>my-project</label>
    </div>
  );
}
