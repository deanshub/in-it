import './globals.css';
import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import { TopBar } from '@/components/TopBar/TopBar';
import { BottomBar } from '@/components/BottomBar/BottomBar';
import { Providers } from '@/components/Providers';
import { getServerSession } from 'next-auth/next';
import { nextAuthOptions } from '@/utils/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'In-It',
  description: 'Analyzes your code and generates a report of your dependencies.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthOptions);

  return (
    <html lang="en">
      <body className={clsx(inter.className, 'min-h-screen flex flex-col', 'dark')}>
        <Providers session={session}>
          <TopBar />
          <div className="flex-1 ">{children}</div>
          <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
