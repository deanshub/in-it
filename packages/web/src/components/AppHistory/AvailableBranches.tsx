import Link from 'next/link';
import { Button } from '../basic/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../basic/dropdown-menu';
import { BranchesOutlined, DownOutlined } from '@ant-design/icons';

interface AvailableBranchesProps {
  branches: string[];
  currentBranch: string;
  appId: string;
  environment: string;
}
export function AvailableBranches({
  branches,
  currentBranch,
  appId,
  environment,
}: AvailableBranchesProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-inherit">
            <BranchesOutlined />
            <span>{currentBranch}</span>
            <DownOutlined />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {branches.map((branch) => (
            <Link
              key={branch}
              href={{
                pathname: `/apps/${appId}`,
                query: {
                  branch: branch !== 'master' ? branch : undefined,
                  environment: environment !== 'ci' ? environment : undefined,
                },
              }}
            >
              <DropdownMenuItem>{branch}</DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
