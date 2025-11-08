'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/tasks', label: 'Tasks' },
  ];

  // Don't show header on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TaskManager</span>
          </Link>

          <nav className="flex items-center gap-6">
            {user && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === link.href
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            )}

            {!user && !isLoading && (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}