'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    clearAuth();
    router.push('/auth/login');
  };

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${pathname.startsWith(href)
        ? 'bg-black text-white dark:bg-white dark:text-black'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          AlgoLLD
        </Link>

        <div className="flex items-center gap-2">
          {navItem('/dsa', 'DSA')}
          {navItem('/lld', 'LLD')}
          {navItem('/lld/solutions', 'Solutions')}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
