import { AppHistory } from '@/components/AppHistory/AppHistory';
import { ProjectsSideBar } from '@/components/ProjectsSideBar/ProjectsSideBar';

export default async function Apps() {
  return (
    <div className="flex">
      <ProjectsSideBar onChange={console.log} />
      <AppHistory />
    </div>
  );
}
