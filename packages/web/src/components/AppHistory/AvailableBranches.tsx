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
}
export function AvailableBranches({ branches, currentBranch, appId }: AvailableBranchesProps) {
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
            <DropdownMenuItem key={branch}>
              <Link href={`/apps/${appId}${branch !== 'master' ? `?branch=${branch}` : ''}`}>
                {branch}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
