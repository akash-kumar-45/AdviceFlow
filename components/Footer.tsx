import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto py-20 border-t border-outline-variant/15 bg-transparent">
      <div className="flex flex-col items-center gap-8 w-full max-w-screen-2xl mx-auto px-12">
        <div className="flex gap-8">
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-xs">Terms</Link>
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-xs">Privacy</Link>
          <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors font-body text-xs">API Attribution</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-outline-variant/30"></div>
          <p className="text-on-surface-variant font-body text-xs">© 2024 AdviceFlow. Powered by Advice Slip API.</p>
          <div className="w-8 h-[1px] bg-outline-variant/30"></div>
        </div>
      </div>
    </footer>
  );
}
