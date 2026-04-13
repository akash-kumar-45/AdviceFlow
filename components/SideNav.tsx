"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";

const links = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Search", href: "/search", icon: "search" },
  { name: "Trending", href: "/trending", icon: "trending_up" },
  { name: "Favorites", href: "/favorites", icon: "favorite" },
  { name: "About", href: "/about", icon: "info" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

export function SideNav() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-surface-container-lowest/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 z-50 bg-surface-container/60 backdrop-blur-3xl border-r border-outline-variant/10 shadow-[40px_0_40px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out-quint flex flex-col pt-6 ${
          sidebarCollapsed ? 'w-20 -translate-x-full lg:translate-x-0' : 'w-64 translate-x-0'
        }`}
      >
        <div className={`flex items-center px-6 mb-12 h-14 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <Link href="/" className="text-xl font-black tracking-tighter text-on-surface font-headline truncate">
              AdviceFlow
            </Link>
          )}
          <button 
            onClick={toggleSidebar}
            className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0 flex items-center justify-center p-2 rounded-lg hover:bg-surface-bright"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined material-icon">
              {sidebarCollapsed ? "menu" : "chevron_left"}
            </span>
          </button>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  // Only auto-close on mobile
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center rounded-xl p-3 transition-all duration-300 ease-out-quint group whitespace-nowrap ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-bright hover:text-on-surface font-medium"
                } ${sidebarCollapsed ? 'justify-center' : 'gap-4'}`}
                title={sidebarCollapsed ? link.name : ""}
              >
                <span className={`material-symbols-outlined material-icon shrink-0 transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}>
                  {link.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-body text-sm tracking-wide flex-1 truncate">
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
