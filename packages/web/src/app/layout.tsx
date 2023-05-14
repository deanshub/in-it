import './globals.css';
import { clsx } from 'clsx';
import { Inter } from 'next/font/google';
import { TopBar } from '@/components/TopBar/TopBar';
import { BottomBar } from '@/components/BottomBar/BottomBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'In-It',
  description: 'Analyzes your code and generates a report of your dependencies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'min-h-screen flex flex-col')}>
        <TopBar />
        <div className="flex-1 ">{children}</div>
        <BottomBar />
      </body>
    </html>
  );
}
