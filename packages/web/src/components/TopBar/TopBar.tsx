'use client';
import Image from 'next/image';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';

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
    <Link
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
      href="/api/auth/signout"
    >
      {user?.name}
    </Link>
  );
}

function Login() {
  return (
    <Link
      href="/api/auth/signin"
      className="flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault();
        signIn('github');
      }}
    >
      <SiGithub />
      Login
    </Link>
  );
}
