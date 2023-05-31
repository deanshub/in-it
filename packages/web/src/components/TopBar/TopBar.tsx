'use client';
import Image from 'next/image';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { BiLogOut } from 'react-icons/bi';
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { Button } from '../basic/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../basic/dropdown-menu';
import { ThemeDropdownMenuGroup } from './ThemeDropdownMenuGroup';

export function TopBar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="flex items-start justify-between p-4">
      <div className="flex flex-center gap-4">
        <Link href="/">
          <Image src="/in-it.svg" alt="In-It Logo" width={50} height={24} priority />
        </Link>
      </div>
      <div className="flex items-center gap-4">{user ? <Logout /> : <Login />}</div>
    </header>
  );
}

function Logout() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <span>{user?.name}</span>
          <Image
            src={user?.image ?? '/unknown.png'}
            alt={user?.name ?? 'unknown'}
            width={32}
            height={32}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <ThemeDropdownMenuGroup />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            prefetch={false}
            href="/api/auth/signout"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
            className="flex items-center gap-2"
          >
            <BiLogOut />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LoginProps {
  variant?: 'link' | 'outline' | 'default' | 'destructive' | 'secondary' | 'ghost';
}
export function Login({ variant = 'ghost' }: LoginProps) {
  return (
    <Link
      prefetch={false}
      href="/api/auth/signin/github"
      className="flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault();
        signIn('github');
      }}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          signIn('github');
        }}
        variant={variant}
        className="flex items-center gap-2"
      >
        <span>Login</span>
        <SiGithub />
      </Button>
    </Link>
  );
}
