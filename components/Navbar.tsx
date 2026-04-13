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
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <header className="bg-surface-container/60 backdrop-blur-3xl sticky top-0 z-50 h-[88px]">
        <nav className="flex justify-between items-center w-full px-8 md:px-12 py-6 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-on-surface font-headline">AdviceFlow</div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-surface-container/60 backdrop-blur-3xl sticky top-0 z-50 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.4)]">
      <nav className="flex justify-between items-center w-full px-8 md:px-12 py-6 max-w-screen-2xl mx-auto relative">
        <Link href="/" className="text-2xl font-black tracking-tighter text-on-surface font-headline z-[60]">
          AdviceFlow
        </Link>

        {/* Desktop Navigation */}
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

        <div className="flex items-center gap-4 md:gap-6 z-[60]">
          <button className="text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200">
            <span className="material-symbols-outlined material-icon">notifications</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined material-icon">
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button className="hidden md:block text-on-surface-variant hover:text-on-surface transition-colors scale-95 hover:scale-100 duration-200">
            <span className="material-symbols-outlined material-icon">account_circle</span>
          </button>

          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden text-on-surface transition-colors p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined material-icon text-3xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-[50] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 bg-surface-container backdrop-blur-3xl md:hidden border-t border-outline-variant/10 shadow-2xl z-[55] flex flex-col p-6 gap-2 animate-in slide-in-from-top duration-300 ease-out-quint">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-4 rounded-xl font-headline tracking-widest text-sm uppercase transition-all ${
                      isActive 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-on-surface-variant hover:bg-surface-bright hover:text-on-surface"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between px-4">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Account</span>
                <span className="material-symbols-outlined material-icon text-on-surface-variant">account_circle</span>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
