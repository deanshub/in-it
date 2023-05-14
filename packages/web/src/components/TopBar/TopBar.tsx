import Image from 'next/image';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import type { User } from 'in-it-shared-types';

interface TopBarProps {
  user?: User;
}

export function TopBar({ user }: TopBarProps) {
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
  return <a href="/api/auth/logout">Logout</a>;
}

function Login() {
  return (
    <a href="/api/auth/login" className="flex items-center gap-2">
      <SiGithub />
      Login
    </a>
  );
}
