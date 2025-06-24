'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, getCurrentUser } from '@/lib/supabase-auth';
import { 
  Car, 
  Tag, 
  Building2, 
  Settings, 
  LogOut, 
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Get current user on component mount
  useEffect(() => {
    let isMounted = true;
    getCurrentUser().then(user => {
      if (isMounted) setUser(user);
    }).catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { icon: Car, label: 'Cars', href: '/admin/cars' },
    { icon: Tag, label: 'Categories', href: '/admin/categories' },
    { icon: Building2, label: 'Brands', href: '/admin/brands' },
    { icon: Settings, label: 'Settings', href: '/admin' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-card shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isCollapsed ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-xl font-semibold text-gray-800">AutoLuxe Admin</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={onToggle}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            {user && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
