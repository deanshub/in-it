import Link from 'next/link';

// interface BottomBarProps {}
// TODO: create all the links
export function BottomBar() {
  return (
    <footer className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4 text-sm">
        <Link href="/terms-of-use">Terms of Use</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/about">About</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/pricing">Pricing</Link>
      </div>
    </footer>
  );
}
