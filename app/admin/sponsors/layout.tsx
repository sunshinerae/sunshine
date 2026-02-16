'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Kanban, Search, Package } from 'lucide-react';

const navItems = [
  { href: '/admin/sponsors', label: 'Pipeline', icon: Kanban },
  { href: '/admin/sponsors/research', label: 'Research', icon: Search },
  { href: '/admin/sponsors/packages', label: 'Packages', icon: Package },
];

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.href === '/admin/sponsors'
                  ? pathname === '/admin/sponsors'
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-zinc-700/60 text-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
