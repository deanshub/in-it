import Link from 'next/link';
import { Button } from '../basic/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../basic/dropdown-menu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { AiOutlineBranches } from 'react-icons/ai';

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
            <AiOutlineBranches />
            <span>{currentBranch}</span>
            <RiArrowDropDownLine />
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
