"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const links = [
  { name: "Home", href: "/" },
  { name: "Trending", href: "/trending" },
  { name: "Search", href: "/search" },
  { name: "Favorites", href: "/favorites" },
  { name: "About", href: "/about" },
  { name: "Settings", href: "/settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-surface-container/60 backdrop-blur-3xl sticky top-0 z-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
      <nav className="flex justify-between items-center w-full px-12 py-6 max-w-screen-2xl mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter text-on-surface font-headline">
          AdviceFlow
        </Link>
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight text-sm uppercase">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`pb-1 hover:scale-[1.02] duration-300 ease-out-quint transition-colors ${
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200">
            <span className="material-symbols-outlined material-icon">notifications</span>
          </button>
          
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200"
            >
              <span className="material-symbols-outlined material-icon">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          <button className="text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200">
            <span className="material-symbols-outlined material-icon">account_circle</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
