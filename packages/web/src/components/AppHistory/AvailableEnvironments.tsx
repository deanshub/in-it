import { VscServerEnvironment } from 'react-icons/vsc';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../basic/dropdown-menu';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { Button } from '../basic/button';
import Link from 'next/link';

interface AvailableEnvironmentsProps {
  environments: string[];
  currentEnvironment: string;
  appId: string;
  branch: string;
}
export function AvailableEnvironments({
  environments,
  currentEnvironment,
  appId,
  branch,
}: AvailableEnvironmentsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 hover:bg-inherit">
          <VscServerEnvironment />
          <span>{currentEnvironment}</span>
          <RiArrowDropDownLine />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {environments.map((env) => (
          <Link
            key={env}
            href={{
              pathname: `/apps/${appId}`,
              query: {
                branch: branch !== 'master' ? branch : undefined,
                environment: env !== 'ci' ? env : undefined,
              },
            }}
          >
            <DropdownMenuItem>{env}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
