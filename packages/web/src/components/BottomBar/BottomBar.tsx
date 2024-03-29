import Link from 'next/link';

// interface BottomBarProps {}
// TODO: create all the links
export function BottomBar() {
  return (
    <footer className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4 text-sm">
        <Link prefetch={false} href="/terms-of-use">
          Terms of Use
        </Link>
        <Link prefetch={false} href="/privacy-policy">
          Privacy Policy
        </Link>
        <Link
          prefetch={false}
          href="mailto: support@nissix.com?subject=Hi in-it&body=I wanted to contact and say"
        >
          Contact
        </Link>
        <Link prefetch={false} href="/about">
          About
        </Link>
        <Link prefetch={false} href="/faq">
          FAQ
        </Link>
        {/* <Link prefetch={false} href="/pricing">
          Pricing
        </Link> */}
      </div>
    </footer>
  );
}
