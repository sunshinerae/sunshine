'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Users, Handshake, Rocket, Send, Palette, LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'People', icon: Users },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/admin/outreach', label: 'Outreach', icon: Send },
  { href: '/admin/growth', label: 'Growth', icon: Rocket },
  { href: '/admin/brand-decks', label: 'Brand Decks', icon: Palette },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // Don't show nav on login page
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {!isLoginPage && (
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-lg font-semibold text-zinc-100">Sunshine</span>
              <nav className="flex items-center gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(href);

                  return (
                    <a
                      key={href}
                      href={href}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-zinc-800 text-zinc-100'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </a>
                  );
                })}
              </nav>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 rounded-lg px-3 py-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
